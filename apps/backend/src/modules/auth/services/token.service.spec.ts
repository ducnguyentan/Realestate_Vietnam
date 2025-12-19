import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { User } from '@realestate/database';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn((payload: { type: string }) => {
              return `mock.jwt.token.${payload.type}`;
            }),
            verify: jest.fn(() => {
              return Promise.resolve({
                sub: 'user-id-123',
                type: 'access',
              });
            }),
            verifyAsync: jest.fn(() => {
              return Promise.resolve({
                sub: 'user-id-123',
                type: 'access',
              });
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.secret') return 'test-secret';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokenPair', () => {
    it('should generate access and refresh tokens', () => {
      const user = {
        id: 'user-id-123',
        email: 'test@example.com',
        phone: '+84901234567',
      } as User;

      const tokenPair = service.generateTokenPair(user);

      expect(tokenPair).toHaveProperty('accessToken');
      expect(tokenPair).toHaveProperty('refreshToken');
      expect(tokenPair).toHaveProperty('expiresIn');
      expect(tokenPair.expiresIn).toBe(15 * 60); // 15 minutes in seconds

      expect(jest.mocked(jwtService.sign)).toHaveBeenCalledTimes(2);
    });

    it('should include user email and phone in payload', () => {
      const user = {
        id: 'user-id-123',
        email: 'test@example.com',
        phone: '+84901234567',
      } as User;

      service.generateTokenPair(user);

      expect(jest.mocked(jwtService.sign)).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'user-id-123',
          email: 'test@example.com',
          phone: '+84901234567',
          type: 'access',
        }),
        expect.any(Object),
      );
    });

    it('should handle user without email', () => {
      const user = {
        id: 'user-id-123',
        phone: '+84901234567',
        email: null,
      } as User;

      const tokenPair = service.generateTokenPair(user);

      expect(tokenPair).toHaveProperty('accessToken');
      expect(tokenPair).toHaveProperty('refreshToken');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const token = 'mock.jwt.token';

      const result = await service.verifyToken(token);

      expect(result).toHaveProperty('sub');
      expect(result.sub).toBe('user-id-123');
    });

    it('should throw error for invalid token', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyToken('invalid-token')).rejects.toThrow();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
        sub: 'user-id-123',
        type: 'refresh',
        email: 'test@example.com',
        phone: '+84901234567',
      });

      const result = await service.refreshAccessToken('refresh-token');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});
