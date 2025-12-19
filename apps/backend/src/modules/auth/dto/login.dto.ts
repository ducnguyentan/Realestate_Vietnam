import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;

  validate() {
    if (!this.phone && !this.email) {
      throw new Error('Either phone or email is required');
    }
    if (!this.password && !this.otp) {
      throw new Error('Either password or OTP is required');
    }
  }
}
