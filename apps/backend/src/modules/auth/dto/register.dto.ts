import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @Matches(/^\+84\d{9,10}$/, {
    message: 'Phone must be in format +84XXXXXXXXX',
  })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  fullName: string = '';

  validate() {
    if (!this.phone && !this.email) {
      throw new Error('Either phone or email is required');
    }
  }
}
