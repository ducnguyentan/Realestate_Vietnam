import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@realestate/database';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, VerifyOtpDto } from './dto';
import { OtpService } from './services/otp.service';
import { TokenService, TokenPair } from './services/token.service';

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Register new user with phone or email
   */
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    registerDto.validate();

    // Check if user already exists
    const existing = await this.userRepository.findOne({
      where: [
        { phone: registerDto.phone },
        { email: registerDto.email },
      ].filter((w) => w.phone || w.email),
    });

    if (existing) {
      throw new ConflictException(
        'User with this phone or email already exists',
      );
    }

    // Hash password if provided
    let passwordHash: string | null = null;
    if (registerDto.password) {
      passwordHash = await bcrypt.hash(
        registerDto.password,
        this.BCRYPT_ROUNDS,
      );
    }

    // Create user (not verified yet)
    const user = this.userRepository.create({
      phone: registerDto.phone || null,
      email: registerDto.email || null,
      passwordHash,
      fullName: registerDto.fullName,
      phoneVerified: false,
      emailVerified: false,
      status: 'active',
      settings: {
        userType: registerDto.userType || 'buyer',
      },
    });

    await this.userRepository.save(user);

    // Send OTP for verification
    const identifier = registerDto.phone || registerDto.email!;
    this.otpService.sendOtp(identifier);

    return {
      message:
        'Registration successful. Please verify your account with the OTP sent.',
    };
  }

  /**
   * Verify phone/email with OTP
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<TokenPair> {
    // Verify OTP
    const isValid = this.otpService.verifyOtp(
      verifyOtpDto.identifier,
      verifyOtpDto.otp,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Find user
    const user = await this.userRepository.findOne({
      where: [
        { phone: verifyOtpDto.identifier },
        { email: verifyOtpDto.identifier },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Mark as verified
    if (user.phone === verifyOtpDto.identifier) {
      user.phoneVerified = true;
    } else {
      user.emailVerified = true;
    }

    await this.userRepository.save(user);

    // Generate tokens
    return this.tokenService.generateTokenPair(user);
  }

  /**
   * Login with password or OTP
   */
  async login(loginDto: LoginDto): Promise<TokenPair> {
    loginDto.validate();

    const identifier = loginDto.identifier || loginDto.phone || loginDto.email!;

    console.log('[AUTH] Login attempt for:', identifier);

    // Find user
    const user = await this.userRepository.findOne({
      where: [{ phone: identifier }, { email: identifier }],
    });

    if (!user) {
      console.log('[AUTH] User not found:', identifier);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(
      '[AUTH] User found:',
      user.email || user.phone,
      'hasPassword:',
      !!user.passwordHash,
    );

    // Check if user is active
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Login with password
    if (loginDto.password) {
      if (!user.passwordHash) {
        throw new BadRequestException(
          'Password not set. Please use OTP login.',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );
      console.log('[AUTH] Password check:', isPasswordValid);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.tokenService.generateTokenPair(user);
    }

    // Login with OTP
    if (loginDto.otp) {
      const isOtpValid = this.otpService.verifyOtp(identifier, loginDto.otp);
      if (!isOtpValid) {
        throw new UnauthorizedException('Invalid OTP');
      }

      return this.tokenService.generateTokenPair(user);
    }

    throw new BadRequestException('Either password or OTP is required');
  }

  /**
   * Send OTP for login
   */
  async sendLoginOtp(identifier: string): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: [{ phone: identifier }, { email: identifier }],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.otpService.sendOtp(identifier);

    return {
      message: 'OTP sent successfully',
    };
  }

  /**
   * Validate user for local strategy
   */
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ phone: identifier }, { email: identifier }],
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const accessToken =
      await this.tokenService.refreshAccessToken(refreshToken);
    return { accessToken };
  }

  /**
   * Resend OTP
   */
  resendOtp(identifier: string): { message: string } {
    this.otpService.sendOtp(identifier);
    return { message: 'OTP resent successfully' };
  }
}
