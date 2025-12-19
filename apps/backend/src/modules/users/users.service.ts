import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@realestate/database';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto, ChangePasswordDto, VerifyIdentityDto } from './dto';

@Injectable()
export class UsersService {
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get user by ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<User> {
    return this.findById(userId);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findById(userId);

    // Check if phone/email already taken by another user
    if (updateProfileDto.phone && updateProfileDto.phone !== user.phone) {
      const existing = await this.userRepository.findOne({
        where: { phone: updateProfileDto.phone },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Phone number already in use');
      }
      user.phoneVerified = false; // Require re-verification
    }

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Email already in use');
      }
      user.emailVerified = false; // Require re-verification
    }

    // Update fields
    Object.assign(user, updateProfileDto);

    return this.userRepository.save(user);
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId);

    if (!user.passwordHash) {
      throw new BadRequestException('No password set. Use OTP login.');
    }

    // Verify current password
    const isValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    user.passwordHash = await bcrypt.hash(
      changePasswordDto.newPassword,
      this.BCRYPT_ROUNDS,
    );
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.findById(userId);
    user.avatarUrl = avatarUrl;
    return this.userRepository.save(user);
  }

  /**
   * Submit identity verification documents
   */
  async verifyIdentity(
    userId: string,
    verifyIdentityDto: VerifyIdentityDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId);

    // Store identity documents (in production, integrate with KYC service)
    user.idCardNumber = verifyIdentityDto.idNumber;
    user.idFrontImage = verifyIdentityDto.idFrontImage;
    user.idBackImage = verifyIdentityDto.idBackImage;
    user.idSelfieImage = verifyIdentityDto.selfieImage;
    user.identityVerified = false; // Pending admin approval
    user.identityVerifiedAt = null;

    await this.userRepository.save(user);

    return { message: 'Identity verification submitted. Awaiting approval.' };
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalListings: number;
    activeListings: number;
    totalLeads: number;
    totalDeals: number;
    completedDeals: number;
  }> {
    // Verify user exists
    await this.findById(userId);

    // In production, aggregate from listings, leads, deals tables
    return {
      totalListings: 0,
      activeListings: 0,
      totalLeads: 0,
      totalDeals: 0,
      completedDeals: 0,
    };
  }
}
