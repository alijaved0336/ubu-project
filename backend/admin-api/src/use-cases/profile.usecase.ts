import { Profile } from '@infrastructure/orm/entities/profile.entity';
import { ProfileResponseDto } from '@infrastructure/presentation/profile/profile.dto';
import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import UsecaseProxy, { AUTH_USECASE_PROXY, USER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AuthUsecase } from './auth.usecase';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { UserUsecase } from './user.usecase';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';

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
  ) {}

  async getProfilesByParentId(parentUserId: number, is_active: boolean): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository.findByParentUserId(parentUserId, is_active);
    return profiles.map((profile) => this.mapToResponseDto(profile));
  }

  async isChildUser(userId: number): Promise<Record<string, any>> {
    const isChildUser = await this.profileRepository.isChildUser(userId);
    let data = {};
    data['is_primary_user'] = !isChildUser;
    if (isChildUser) {
      const childProfile = await this.profileRepository.findByChildUserId(userId);
      data['sub_profile_relation'] = childProfile?.relation;
      data['is_dependent'] = childProfile?.isDependant;
    }
    return data;
  }
  async getProfileByChildId(childUserId: number): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findByChildUserId(childUserId);

    if (!profile) {
      throw new NotFoundException('Profile not found for the specified child user');
    }

    return this.mapToResponseDto(profile);
  }

  async getProfileById(profileId: number, requestingUserId: number): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Check if requesting user has permission to view this profile
    const hasPermission = profile.parent_user_id === requestingUserId || profile.child_user_id === requestingUserId;

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to view this profile');
    }

    return this.mapToResponseDto(profile);
  }

  async deleteProfile(profileId: number, requestingUserId: number): Promise<void> {
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

  async linkChildUserToProfile(profileId: number, childUserId: number, parentUserId: number): Promise<ProfileResponseDto> {
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
    const existingChildProfile = await this.profileRepository.findByChildUserId(childUserId);
    if (existingChildProfile) {
      throw new BadRequestException('Child user is already linked to another profile');
    }

    const updatedProfile = await this.profileRepository.linkChildUser(profileId, childUserId);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to link child user to profile');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async unlinkChildUserFromProfile(profileId: number, requestingUserId: number): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Only parent user can unlink child users
    if (profile.parent_user_id !== requestingUserId) {
      throw new ForbiddenException('Only the parent user can unlink child users');
    }

    if (!profile.child_user_id) {
      throw new BadRequestException('Profile does not have a linked child user');
    }

    const updatedProfile = await this.profileRepository.unlinkChildUser(profileId);

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
      parent_user: profile.parent_user
        ? {
            id: profile.parent_user.id,
            email: profile.parent_user.email,
            first_name: profile.parent_user.first_name,
            last_name: profile.parent_user.last_name,
          }
        : undefined,
      child_user: profile.child_user
        ? {
            id: profile.child_user.id,
            email: profile.child_user.email,
            first_name: profile.child_user.first_name,
            last_name: profile.child_user.last_name,
          }
        : undefined,
    };
  }
}
