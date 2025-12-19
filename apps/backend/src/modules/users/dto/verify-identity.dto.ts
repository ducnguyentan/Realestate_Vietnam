import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyIdentityDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{9,12}$/, { message: 'CCCD/CMND must be 9-12 digits' })
  idNumber: string = '';

  @IsNotEmpty()
  @IsString()
  idFrontImage: string = ''; // URL to uploaded image

  @IsNotEmpty()
  @IsString()
  idBackImage: string = ''; // URL to uploaded image

  @IsNotEmpty()
  @IsString()
  selfieImage: string = ''; // URL to uploaded selfie
}
