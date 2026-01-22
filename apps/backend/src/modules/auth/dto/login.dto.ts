import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  identifier?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  validate() {
    const loginIdentifier = this.identifier || this.phone || this.email;
    if (!loginIdentifier) {
      throw new Error('Either identifier, phone or email is required');
    }
    if (!this.password && !this.otp) {
      throw new Error('Either password or OTP is required');
    }
  }
}
