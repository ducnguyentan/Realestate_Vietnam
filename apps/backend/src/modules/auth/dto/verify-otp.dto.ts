import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string = ''; // phone or email

  @IsNotEmpty()
  @IsString()
  otp: string = '';
}
