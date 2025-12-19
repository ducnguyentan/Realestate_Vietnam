import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, RefreshTokenDto } from './dto';
import { Public } from './decorators/public.decorator';
import { TokenPair } from './services/token.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and complete registration/login' })
  @ApiResponse({ status: 200, description: 'OTP verified, tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<TokenPair> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with password or OTP' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<TokenPair> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for login' })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async sendOtp(@Body() body: { identifier: string }) {
    return this.authService.sendLoginOtp(body.identifier);
  }

  @Public()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent' })
  resendOtp(@Body() body: { identifier: string }) {
    return this.authService.resendOtp(body.identifier);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout (client should delete tokens)' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout() {
    // In MVP1, logout is handled client-side by deleting tokens
    // In production, implement token blacklist with Redis
    return { message: 'Logout successful' };
  }
}
