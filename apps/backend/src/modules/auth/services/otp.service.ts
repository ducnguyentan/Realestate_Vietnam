import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OtpRecord {
  code: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpStore = new Map<string, OtpRecord>();
  private readonly OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ATTEMPTS = 3;
  private readonly MOCK_OTP = '123456'; // Mock OTP for development

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generate and send OTP to phone/email
   * Mock implementation for MVP1 - always returns fixed OTP
   */
  sendOtp(identifier: string): void {
    // Clean up expired OTPs
    this.cleanupExpiredOtps();

    // Check rate limiting
    const existing = this.otpStore.get(identifier);
    if (existing && existing.expiresAt > new Date()) {
      throw new Error('OTP already sent. Please wait before requesting again.');
    }

    const otp =
      this.configService.get('NODE_ENV') === 'production'
        ? this.generateRandomOtp()
        : this.MOCK_OTP;

    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);

    this.otpStore.set(identifier, {
      code: otp,
      expiresAt,
      attempts: 0,
    });

    this.logger.log(
      `OTP sent to ${identifier}: ${otp} (expires: ${expiresAt.toISOString()})`,
    );

    // In production, integrate with Twilio/Stringee/eSMS here
    // await this.smsProvider.send(identifier, `Your OTP: ${otp}`);
  }

  /**
   * Verify OTP code
   */
  verifyOtp(identifier: string, code: string): boolean {
    const record = this.otpStore.get(identifier);

    if (!record) {
      throw new Error('No OTP found. Please request a new one.');
    }

    if (record.expiresAt < new Date()) {
      this.otpStore.delete(identifier);
      throw new Error('OTP expired. Please request a new one.');
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(identifier);
      throw new Error('Too many failed attempts. Please request a new OTP.');
    }

    if (record.code !== code) {
      record.attempts++;
      this.otpStore.set(identifier, record);
      throw new Error(
        `Invalid OTP. ${this.MAX_ATTEMPTS - record.attempts} attempts remaining.`,
      );
    }

    // Success - remove OTP
    this.otpStore.delete(identifier);
    this.logger.log(`OTP verified successfully for ${identifier}`);
    return true;
  }

  /**
   * Generate random 6-digit OTP
   */
  private generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Cleanup expired OTPs to prevent memory leak
   */
  private cleanupExpiredOtps(): void {
    const now = new Date();
    for (const [identifier, record] of this.otpStore.entries()) {
      if (record.expiresAt < now) {
        this.otpStore.delete(identifier);
      }
    }
  }
}
