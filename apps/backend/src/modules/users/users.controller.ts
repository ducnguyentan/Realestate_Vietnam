import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto, VerifyIdentityDto } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface UserPayload {
  userId: string;
  email?: string;
  phone?: string;
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@CurrentUser() user: UserPayload) {
    return this.usersService.getProfile(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 409, description: 'Phone/Email already in use' })
  async updateProfile(
    @CurrentUser() user: UserPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, updateProfileDto);
  }

  @Post('me/change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed' })
  @ApiResponse({ status: 400, description: 'Current password incorrect' })
  async changePassword(
    @CurrentUser() user: UserPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.userId, changePasswordDto);
  }

  @Post('me/avatar')
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // In production: Upload to S3/MinIO, get URL
    const avatarUrl = `https://storage.example.com/avatars/${user.userId}/${file.originalname}`;
    return this.usersService.uploadAvatar(user.userId, avatarUrl);
  }

  @Post('me/verify-identity')
  @ApiOperation({
    summary: 'Submit identity verification documents (CCCD/CMND)',
  })
  @ApiResponse({ status: 200, description: 'Identity verification submitted' })
  async verifyIdentity(
    @CurrentUser() user: UserPayload,
    @Body() verifyIdentityDto: VerifyIdentityDto,
  ) {
    return this.usersService.verifyIdentity(user.userId, verifyIdentityDto);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStats(@CurrentUser() user: UserPayload): Promise<{
    totalListings: number;
    activeListings: number;
    totalLeads: number;
    totalDeals: number;
    completedDeals: number;
  }> {
    return this.usersService.getUserStats(user.userId);
  }
}
