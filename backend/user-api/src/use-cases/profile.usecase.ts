import { Profile } from '@infrastructure/orm/entities/profile.entity';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import {
  CombinedUserProfileDto,
  CreateProfileDto,
  GetRevertProfilesQueryDto,
  ProfileResponseDto,
  UpdatedCombinedUserProfileDTO,
  UpdateProfileDto,
} from '@infrastructure/presentation/profile/profile.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  USER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from './auth.usecase';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { UserUsecase } from './user.usecase';
import { Bool } from 'aws-sdk/clients/clouddirectory';
import { AffiliateRepository } from '@infrastructure/orm/reposiories/affiliate.repository';
import { InfluencerStripeConnectedAccount } from '@infrastructure/orm/entities/influencer-stripe-connected-account.entity';
import { InfluencerStripeConnectedAccountRepository } from '@infrastructure/orm/reposiories/stirpe-connected-account.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { User } from '@infrastructure/orm/entities/user.entity';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';

const MINIMUM_REVENUE_THRESHOLD = 10;
const WITHDRAWAL_TIMEOUT = 30000; // 30 seconds

// Types
interface WithdrawalPayload {
  amount: Number;
  influencer_id: number;
  stripe_connected_account_id: string;
}

export interface UnlinkResult {
  message: string;
  response_code: string;
}

@Injectable()
export class ProfileUseCase {
  private readonly MAX_PROFILES_PER_PARENT = 5;

  constructor(
    private readonly profileRepository: ProfileRepository,
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
    private readonly userRepository: UserRepository,
    @Inject(USER_USECASE_PROXY)
    private readonly userUsecaseProxy: UsecaseProxy<UserUsecase>,
    private readonly affliateRepository: AffiliateRepository,
    private readonly stripeConnectedAccount: InfluencerStripeConnectedAccountRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly notificationRepo: NotificationRepository,
  ) {}

  async createProfile(
    createProfileDto: CreateProfileDto,
    parentUserId: number,
  ): Promise<ProfileResponseDto> {
    // Check if parent already has maximum profiles
    const existingProfilesCount =
      await this.profileRepository.countActiveProfilesByParentId(parentUserId);

    if (existingProfilesCount >= this.MAX_PROFILES_PER_PARENT) {
      throw new BadRequestException(
        `Maximum ${this.MAX_PROFILES_PER_PARENT} profiles allowed per parent user`,
      );
    }

    const profileData = {
      ...createProfileDto,
      parent_user_id: parentUserId,
    };

    const profile = await this.profileRepository.create(profileData);

    return this.mapToResponseDto(profile);
  }

  async getProfilesByParentId(
    userId: number,
    is_active: boolean,
  ): Promise<ProfileResponseDto[] | ProfileResponseDto> {
    let profiles = await this.profileRepository.findByParentUserId(
      userId,
      is_active,
    );

    if (profiles.length <= 0) {
      const profile = await this.getProfileByChildId(userId);
      return [profile];
    }

    return profiles.map((profile) => this.mapToResponseDto(profile));
  }

  async getProfileByChildId(childUserId: number): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findByChildUserId(childUserId);

    if (!profile) {
      throw new NotFoundException(
        'Profile not found for the specified child user',
      );
    }

    return this.mapToResponseDto(profile);
  }

  async getProfileById(
    profileId: number,
    requestingUserId: number,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Check if requesting user has permission to view this profile
    const hasPermission =
      profile.parent_user_id === requestingUserId ||
      profile.child_user_id === requestingUserId;

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to view this profile',
      );
    }

    return this.mapToResponseDto(profile);
  }

  async updateProfile(
    profileId: number,
    parentUserId: number,
    childUserId: number,
    updateProfileDto: UpdatedCombinedUserProfileDTO,
  ): Promise<String> {
    const existingProfile = await this.profileRepository.findById(profileId);
    const existingUser = await this.userRepository.findById(childUserId);
    const { profile, user } = updateProfileDto;

    if (!existingProfile || !profile || !existingUser || !user) {
      throw new NotFoundException('Profile or User not found');
    }

    // Check if requesting user has permission to update this profile
    const hasPermission =
      existingProfile.parent_user_id === parentUserId ||
      existingProfile.child_user_id === childUserId;

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to update this profile',
      );
    }

    if (user) {
      await this.userRepository.updateUser(childUserId, user);
    }

    const updatedProfile = await this.profileRepository.update(
      profileId,
      profile,
    );

    if (!updatedProfile) {
      throw new NotFoundException('Profile not found after update');
    }

    return 'Successfully Updated Profile';
  }

  async deleteProfile(
    profileId: number,
    requestingUserId: number,
  ): Promise<void> {
    const existingProfile = await this.profileRepository.findById(profileId);

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Only parent user can delete profiles
    if (existingProfile.parent_user_id !== requestingUserId) {
      throw new ForbiddenException('Only the parent user can delete profiles');
    }

    const success = await this.profileRepository.delete(profileId);

    if (!success) {
      throw new BadRequestException('Failed to delete profile');
    }
  }

  async linkChildUserToProfile(
    profileId: number,
    childUserId: number,
    parentUserId: number,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findById(profileId);
    const childUser = await this.userRepository.findById(childUserId);
    const parentUser = await this.userRepository.findById(parentUserId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Only parent user can link child users
    if (profile.parent_user_id !== parentUserId) {
      throw new ForbiddenException('Only the parent user can link child users');
    }

    if (profile.child_user_id) {
      throw new BadRequestException('Profile already has a linked child user');
    }

    // Check if child user is already linked to another profile
    const existingChildProfile =
      await this.profileRepository.findByChildUserId(childUserId);
    if (existingChildProfile) {
      throw new BadRequestException(
        'Child user is already linked to another profile',
      );
    }

    const updatedProfile = await this.profileRepository.linkChildUser(
      profileId,
      childUserId,
    );

    if (!updatedProfile) {
      throw new BadRequestException('Failed to link child user to profile');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async unlinkChildUserFromProfile(
    profileId: number,
    requestingUserId: number,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Only parent user can unlink child users
    if (profile.parent_user_id !== requestingUserId) {
      throw new ForbiddenException(
        'Only the parent user can unlink child users',
      );
    }

    if (!profile.child_user_id) {
      throw new BadRequestException(
        'Profile does not have a linked child user',
      );
    }

    const updatedProfile =
      await this.profileRepository.unlinkChildUser(profileId);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to unlink child user from profile');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  private mapToResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      // name: profile.name,
      relation: profile.relation,
      is_active: profile.is_active,
      parent_user_id: profile.parent_user_id,
      child_user_id: profile.child_user_id,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      isDependant: profile.isDependant,
      parent_user: profile.parent_user
        ? {
            id: profile.parent_user.id,
            email: profile.parent_user.email,
            first_name: profile.parent_user.first_name,
            last_name: profile.parent_user.last_name,
            avatar:
              profile?.parent_user?.consumer?.avatar ||
              profile?.parent_user?.influencer?.avatar ||
              undefined,
          }
        : undefined,
      child_user: profile.child_user
        ? {
            id: profile.child_user.id,
            email: profile.child_user.email,
            first_name: profile.child_user.first_name,
            last_name: profile.child_user.last_name,
            avatar:
              profile?.child_user?.consumer?.avatar ||
              profile?.child_user?.influencer?.avatar ||
              undefined,
          }
        : undefined,
    };
  }

  async createChildUserAndLinkToProfile(
    combinedUserProfileDto: CombinedUserProfileDto,
    parent_user_id: number,
  ) {
    let {
      user: { ...userPayload },
      profile: profilePayload,
    } = combinedUserProfileDto;

    const existingProfilesCount =
      await this.profileRepository.countActiveProfilesByParentId(
        parent_user_id,
      );

    if (existingProfilesCount >= this.MAX_PROFILES_PER_PARENT) {
      throw new BadRequestException(
        `Maximum ${this.MAX_PROFILES_PER_PARENT} profiles allowed per parent user`,
      );
    }

    const user = await this.authUsecaseProxy
      .getInstance()
      .register(userPayload);
    const profile = await this.createProfile(
      { ...profilePayload },
      parent_user_id,
    );
    await this.linkChildUserToProfile(profile.id, user.id!, parent_user_id);
    return user;
  }

  async unlinkChildProfile(
    childUserId: number,
    isSoftDelete: boolean,
  ): Promise<UnlinkResult> {
    const user = await this.findUserById(childUserId);
    const profile = this.validateChildProfile(user, childUserId);

    if (profile.isDependant) {
      return await this.handleDependentProfile(
        childUserId,
        profile,
        isSoftDelete,
      );
    }

    return await this.handleIndependentProfile(
      childUserId,
      user,
      profile,
      isSoftDelete,
    );
  }

  /**
   * Deletes profile and associated child users
   * @param profileId - ID of the profile to delete
   * @param parentUserId - ID of the parent user
   * @param isSoftDelete - Whether to perform soft delete
   */
  async deleteProfileAndChildUsers(
    profileId: number,
    parentUserId: number,
    isSoftDelete: boolean = false,
    isSecondAttempt: boolean = false,
  ): Promise<void | UnlinkResult> {
    const { profile, parentUser } = await this.validateProfileAndParent(
      profileId,
      parentUserId,
    );
    let result;

    if (!profile.deletedAt) {
      if (profile.child_user) {
        if (isSecondAttempt) {
          return this.processChildUserDeletion(
            profile.child_user,
            isSoftDelete,
          );
        }
        result = await this.processChildUserDeletionAndAmountValidation(
          profile.child_user,
          parentUser,
          isSoftDelete,
        );
      }
      if (result as number) return result;
      else {
        return await this.softDeleteProfile(
          profileId,
          parentUserId,
          isSoftDelete,
        );
      }
    }

    return {
      response_code: 'SD',
      message: `Profile already have been soft deleted and funds have been transferred. Will be permanently deleted after 10 days`,
    };
  }

  private async findUserById(userId: number) {
    const user = await this.userRepository.findDeletedAndNonDeletedById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  private validateChildProfile(user: any, userId: number) {
    const profile = user.childProfile;
    if (!profile) {
      throw new BadRequestException(
        'User does not have a linked child profile',
      );
    }
    return profile;
  }

  private async handleDependentProfile(
    childUserId: number,
    profile: any,
    isSoftDelete: boolean,
  ): Promise<UnlinkResult> {
    const result = await this.deleteProfileAndChildUsers(
      profile.id,
      profile.parent_user_id,
      isSoftDelete,
    );

    if ((result as UnlinkResult)?.response_code) {
      return result as UnlinkResult;
    }

    return {
      response_code: 'SD',
      message: `Profile soft deleted${(result as unknown as number) < 0 ? ' and funds have been transferred.' : '.'} Will be permanently deleted after 10 days`,
    };
  }

  private async handleIndependentProfile(
    childUserId: number,
    user: any,
    profile: any,
    isSoftDelete: boolean,
  ): Promise<UnlinkResult> {
    user.childProfile = undefined;
    user.parentProfiles = [];
    await this.userRepository.save(user);

    if (isSoftDelete) {
      await this.profileRepository.softDeleteProfilyByIdAndParentId(
        profile.id,
        profile.parent_user_id,
      );
    } else {
      await this.profileRepository.deleteProfilyByIdAndParentId(
        profile.id,
        profile.parent_user_id,
      );
    }
    await this.notificationRepo.sendNotificationToUserDevices({
      receiverUserId: childUserId,
      receiverUserType: 'user',
      senderUserId: profile.parent_user_id,
      senderUserType: 'user',
      title: 'Unlinked By Parent',
      body: 'You are unlinked by parent, Now you are primary user.',
      content: 'You are unlinked by parent, Now you are primary user.',
      type: 'follow',
      saveToDatabase: true,
    });

    return {
      response_code: 'UL',
      message: `Child profile unlinked and user (ID: ${childUserId}) is now primary.`,
    };
  }

  private async validateProfileAndParent(
    profileId: number,
    parentUserId: number,
  ) {
    const [profile, parentUser] = await Promise.all([
      this.profileRepository.findAllNormalAndDeletedById(profileId),
      this.userRepository.findDeletedAndNonDeletedById(parentUserId),
    ]);

    if (!profile || !parentUser) {
      throw new NotFoundException(
        'Profile or Parent User not found or you do not have permission to delete it',
      );
    }

    return { profile, parentUser };
  }

  private async processChildUserDeletionAndAmountValidation(
    childUser: any,
    parentUser: any,
    isSoftDelete: boolean,
  ): Promise<void | number | UnlinkResult> {
    const user = await this.findUserById(childUser.id);

    if (user.influencer) {
      const revenueAmount = await this.validateAndGetRevenue(
        user.influencer.id,
        user,
        isSoftDelete,
      );
      if ((revenueAmount as UnlinkResult).response_code) {
        return revenueAmount as UnlinkResult;
      } else {
        if ((revenueAmount as number) > 0) {
          const stripeAccountId = await this.validateStripeAccount(
            parentUser.influencer.id,
          );
          await this.processWithdrawal(
            revenueAmount as Number,
            user.influencer.id,
            stripeAccountId,
          );
        } else {
          return revenueAmount;
        }
      }
    }
  }

  async processChildUserDeletion(user: User, isSoftDelete: boolean) {
    await this.userUsecaseProxy
      .getInstance()
      .deleteOrRevertUser(user, isSoftDelete);
  }

  private async validateAndGetRevenue(
    influencerId: number,
    user: User,
    isSoftDelete: boolean,
  ): Promise<number | UnlinkResult> {
    const affiliateWithRev =
      await this.affliateRepository.findRevenueByInfluencerId(influencerId);

    const revenue = affiliateWithRev?.revenue;
    if (revenue === undefined || revenue === null) {
      console.log('Revenue data not found for this influencer');
    }

    const revenueAmount = Number(revenue);
    if (isNaN(revenueAmount)) {
      console.log('Invalid revenue amount - not a valid number');
    }

    if (revenueAmount < MINIMUM_REVENUE_THRESHOLD) {
      return {
        message: `Show warning popup and call "api/profiles/delete-profile/{profileId}" api to perm delete the profile`,
        response_code: 'LA',
      };
    }

    await this.processChildUserDeletion(user, isSoftDelete);
    return revenueAmount || 0;
  }

  private async validateStripeAccount(influencerId: number) {
    const stripeConnectedAccount =
      await this.stripeConnectedAccount.findAccountIdByInfluencerId(
        influencerId,
      );

    if (!stripeConnectedAccount?.stripe_connected_account_id) {
      throw new BadRequestException('Please Setup Account First');
    }

    return stripeConnectedAccount.stripe_connected_account_id;
  }

  private async processWithdrawal(
    amount: Number,
    influencerId: number,
    stripe_connected_account_id: string,
  ): Promise<void> {
    const withdrawalPayload: WithdrawalPayload = {
      amount,
      influencer_id: influencerId,
      stripe_connected_account_id,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get('AdminAPI').adminAPI}/withdrawals`,
          withdrawalPayload,
          {
            headers: {
              'x-user-api-token':
                this.configService.get('AdminAPI').userApiToken,
              'Content-Type': 'application/json',
            },
            timeout: WITHDRAWAL_TIMEOUT,
          },
        ),
      );

      console.log('Withdrawal processed successfully:', response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(
        'Error creating withdrawal:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        `Failed to create withdrawal: ${errorMessage}`,
      );
    }
  }

  private async softDeleteProfile(
    profileId: number,
    parentUserId: number,
    isSoftDelete: boolean,
  ): Promise<void> {
    if (isSoftDelete) {
      await this.profileRepository.softDeleteProfilyByIdAndParentId(
        profileId,
        parentUserId,
      );
    } else {
      await this.profileRepository.deleteProfilyByIdAndParentId(
        profileId,
        parentUserId,
      );
    }
  }

  async getSoftDeletedProfilesByParentId(
    userId: number,
  ): Promise<ProfileResponseDto[] | ProfileResponseDto> {
    const profiles =
      await this.profileRepository.findSoftDeletedByParentUserId(userId);

    // if (profiles.length <= 0) {
    //   // Check if user has any soft-deleted profile as a child
    //   const profile = await this.getSoftDeletedProfileByChildId(userId);
    //   return profile ? [profile] : [];
    // }

    return profiles.map((profile) => this.mapToResponseDto(profile)) ?? [];
  }

  async getSoftDeletedProfileByChildId(
    userId: number,
  ): Promise<ProfileResponseDto | null> {
    const profile =
      await this.profileRepository.findSoftDeletedByChildUserId(userId);
    return profile ? this.mapToResponseDto(profile) : null;
  }

  async revertProfile(queryDto: GetRevertProfilesQueryDto) {
    const { user_id, profile_id } = queryDto;
    const user = await this.findUserById(user_id);
    const profile =
      await this.profileRepository.findAllNormalAndDeletedById(profile_id);

    const existingProfilesCount: any =
      await this.profileRepository.countActiveSiblingsByChildUserId(user_id);
    if (existingProfilesCount >= this.MAX_PROFILES_PER_PARENT) {
      throw new BadRequestException(
        'You’ve already added 5 active child users. To make it active, please delete one of the existing children first.',
      );
    }
    if (!profile) {
      throw new BadRequestException('Profile Not Found');
    }
    if (profile?.child_user_id) {
      const IsChild = await this.profileRepository.isChildUser(
        profile.child_user_id,
      );
      const IsParent = await this.profileRepository.isParentUser(
        profile.child_user_id,
      );
      if (IsChild || IsParent) {
        throw new BadRequestException(
          'Child/Parent of any other user now you cant revert it',
        );
      }
    }
    await this.profileRepository.restoreSoftDeleteProfilyById(profile.id);
    return this.userUsecaseProxy
      .getInstance()
      .deleteOrRevertUser(user, false, true);
  }
}
