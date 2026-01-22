import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@realestate/database';

export interface JwtPayload {
  sub: string; // user ID
  email?: string;
  phone?: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user?: User;
}

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '30d';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate access and refresh tokens for user
   */
  generateTokenPair(user: User): TokenPair {
    const payload: Omit<JwtPayload, 'type'> = {
      sub: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
    };

    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      { expiresIn: this.ACCESS_TOKEN_EXPIRY },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: this.REFRESH_TOKEN_EXPIRY },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      user,
    };
  }

  /**
   * Verify and decode JWT token
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const payload = await this.verifyToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const newPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      phone: payload.phone,
      type: 'access',
    };

    return this.jwtService.sign(newPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }
}
