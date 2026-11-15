import { User } from '@infrastructure/orm/entities/user.entity';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { ForgotPasswordTokenRepository } from '@infrastructure/orm/reposiories/forgot-password-token.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { deleteResponseDto, updateUserDto, UserDetailsDtoMobile } from '@infrastructure/presentation/user/user.dto';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getEmailContent } from 'constants/forgotPasswordEmailTemplate';
import * as crypto from 'crypto';
import { UpdateResult } from 'typeorm';

export class UserUsecase {
  constructor(
    private userRepository: UserRepository,
    private brandRepository: BrandRepository,
    private influencerRepository: InfluencerRepository,
    private forgotPasswordTokenRepository: ForgotPasswordTokenRepository,
    private bcryptService: BcryptService,
    private readonly mailGunService: MailGunService,
    private awsS3Service: AwsS3Service,
    private consumerRepository: ConsumerRepository,
  ) {}

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new NotFoundException('We couldn’t find an account with that email address. Please check for any typos or try a different email.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    await this.forgotPasswordTokenRepository.delete(user.id);
    await this.forgotPasswordTokenRepository.create({
      token,
      user,
    });
    const content = getEmailContent(token);
    await this.mailGunService.sendEmail(user.email, 'Password Reset Request', content, true);

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const forgotPasswordToken = await this.forgotPasswordTokenRepository.findOne({ token }, ['user']);
    if (!forgotPasswordToken) {
      throw new BadRequestException('Invalid or expired token.');
    }
    const user = forgotPasswordToken.user;
    const encryptedPassword = await this.bcryptService.encryptPassword(newPassword);
    user.password = encryptedPassword;
    await this.userRepository.save(user);
    this.forgotPasswordTokenRepository.delete(user.id);
  }
  async updateByIdNew(user: User, payload: UserDetailsDtoMobile) {
    try {
      if (payload) {
        const { avatar, ...userDetailsWithoutAvatar } = payload;
        await this.influencerRepository.updateById(user.influencer.id, { avatar });
        await this.userRepository.update(user.id, userDetailsWithoutAvatar);
      }
      return {
        success: true,
        message: 'User updated successfully',
      };
      // const userData = await this.influencerUseCase.getInstance().getById(user.influencer.id);
      // return userData;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async getAmazonInfluencers(page: number, limit: number, search?: string) {
    return await this.userRepository.findAmazonInfluencers(page, limit, search);
  }
  async changePassword(oldPassword: string, newPassword: string, userId: number): Promise<UpdateResult> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }

    const encryptedNewPassword = await this.bcryptService.encryptPassword(newPassword);

    const isPasswordMatched = await this.bcryptService.comparePassword(oldPassword, existingUser.password);

    if (!isPasswordMatched) {
      throw new BadRequestException('Old Password is not correct');
    }

    const isNewPasswordSameAsOldOne = await this.bcryptService.comparePassword(newPassword, existingUser.password);

    if (isNewPasswordSameAsOldOne) {
      throw new BadRequestException('The new password must be different from the current password. Please choose a different password.');
    }

    return await this.userRepository.update(userId, {
      password: encryptedNewPassword,
    });
  }

  async updateProfilePhoto(userId, files: Express.Multer.File[]) {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new Error(`User not found.`);
    }

    const folderName = `profiles/${userId}/`;
    if (files && files.length) {
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
      await this.awsS3Service.createFolder(folderName);
      const s3Response = await this.awsS3Service.uploadMultipleFiles(files, folderName);
      existingUser.influencer.avatar = s3Response[0].url;
    } else {
      existingUser.influencer.avatar = '';
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
    }
    await this.influencerRepository.updateById(existingUser.influencer.id, { avatar: existingUser.influencer.avatar });
    return this.userRepository.findById(userId);
  }

  async updateBrandProfilePhoto(userId, files: Express.Multer.File[]) {
    const existingUser = await this.userRepository.findById(userId);
    console.log('existingUserexistingUser', existingUser);
    if (!existingUser) {
      throw new Error(`User not found.`);
    }

    const folderName = `profiles/${userId}/`;
    if (files && files.length) {
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
      await this.awsS3Service.createFolder(folderName);
      const s3Response = await this.awsS3Service.uploadMultipleFiles(files, folderName);
      existingUser.brand.avatar = s3Response[0].url;
    } else {
      existingUser.brand.avatar = '';
      await this.awsS3Service.deleteAllFilesInFolder(folderName);
    }
    await this.brandRepository.updateColumn(existingUser.brand.id, { avatar: existingUser.brand.avatar });
    return this.userRepository.findById(userId);
  }

  async update(userId: number, updateUserDto: updateUserDto) {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const { brand_name, ...updatedUserDto } = updateUserDto;

    if (existingUser.is_brand) {
      const brand = await this.brandRepository.findByUserId(existingUser.id);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
      await this.brandRepository.updateColumn(brand.id, { brand_name: brand_name });
    }

    const updatedUser = await this.userRepository.update(userId, updatedUserDto);
    return updatedUser;
  }
  async deleteUser(user: User): Promise<deleteResponseDto> {
    try {
      if (user.is_deleted) {
        return {
          statusCode: 200,
          message: `Account has been removed already successfully.`,
        };
      } else {
        if (user.is_brand) {
          await this.brandRepository.deleteBrandPartially(user.brand.id);
          await this.userRepository.deleteUserPartially(user.id);
        } else {
          if (!user.is_influencer && user.is_consumer) {
            throw new BadRequestException('Cannot Delete Consumer from here.');
          }
          if (user.is_influencer && user.is_consumer) {
            await this.consumerRepository.deleteConsumerData(user?.consumer?.id);
          }

          await this.influencerRepository.deleteInfluencerData(user?.influencer?.id);
          await this.userRepository.deleteUserPartially(user.id);
        }

        return {
          statusCode: 200,
          message: `Account has been removed successfully.`,
        };
      }
    } catch (error) {
      throw new BadRequestException(`Failed to delete user with ID ${user.id}: ${error.message}`);
    }
  }

  findById(id) {
    return this.userRepository.findById(id);
  }

  async findUserByConditionwithRelation(condition, relations?, select?) {
    return this.userRepository.findUserByConditionwithRelation(condition, relations, select);
  }
}
