import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') return 'development';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should send OTP successfully', () => {
      const identifier = '+84901234567';
      expect(() => service.sendOtp(identifier)).not.toThrow();
    });

    it('should throw error if OTP already sent and not expired', () => {
      const identifier = '+84901234567';
      service.sendOtp(identifier);

      expect(() => service.sendOtp(identifier)).toThrow(
        'OTP already sent. Please wait before requesting again.',
      );
    });
  });

  describe('verifyOtp', () => {
    it('should verify correct OTP successfully', () => {
      const identifier = '+84901234567';
      service.sendOtp(identifier);

      const result = service.verifyOtp(identifier, '123456');
      expect(result).toBe(true);
    });

    it('should throw error for non-existent OTP', () => {
      const identifier = '+84901234567';

      expect(() => service.verifyOtp(identifier, '123456')).toThrow(
        'No OTP found. Please request a new one.',
      );
    });

    it('should throw error for incorrect OTP', () => {
      const identifier = '+84901234567';
      service.sendOtp(identifier);

      expect(() => service.verifyOtp(identifier, '999999')).toThrow(
        'Invalid OTP',
      );
    });

    it('should throw error after max attempts', () => {
      const identifier = '+84901234567';
      service.sendOtp(identifier);

      // Attempt 3 times with wrong OTP
      expect(() => service.verifyOtp(identifier, '111111')).toThrow(
        'Invalid OTP',
      );
      expect(() => service.verifyOtp(identifier, '222222')).toThrow(
        'Invalid OTP',
      );
      expect(() => service.verifyOtp(identifier, '333333')).toThrow(
        'Invalid OTP',
      );
    });
  });

  describe('mock OTP in development', () => {
    it('should use mock OTP (123456) in development', () => {
      const identifier = '+84901234567';
      service.sendOtp(identifier);

      const result = service.verifyOtp(identifier, '123456');
      expect(result).toBe(true);
    });
  });
});
