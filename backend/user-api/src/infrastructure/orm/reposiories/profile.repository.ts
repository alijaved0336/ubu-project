import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import {
  CreateProfileDto,
  UpdateProfileDto,
} from '@infrastructure/presentation/profile/profile.dto';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profileRepository.create(createProfileDto);
    return await this.profileRepository.save(profile);
  }

  async findById(id: number): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: { id },
      relations: [
        'parent_user',
        'child_user',
        'child_user.consumer',
        'child_user.influencer',
        'parent_user.consumer',
        'parent_user.influencer',
      ],
    });
  }

  async findByParentUserId(
    parentUserId: number,
    is_active,
  ): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        is_active: is_active,
      },
      relations: [
        'child_user',
        'parent_user',
        'child_user.consumer',
        'child_user.influencer',
        'parent_user.consumer',
        'parent_user.influencer',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async findByChildUserId(childUserId: number): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: {
        child_user_id: childUserId,
      },
      relations: [
        'parent_user',
        'child_user',
        'child_user.consumer',
        'child_user.influencer',
        'parent_user.consumer',
        'parent_user.influencer',
      ],
    });
  }
  async isParentUser(parentUserId: number): Promise<boolean> {
    const exists = await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.parent_user_id = :parentUserId', { parentUserId })
      .andWhere('profile.is_active = true')
      .getExists();

    return exists;
  }

  async countActiveProfilesByParentId(parentUserId: number): Promise<number> {
    return await this.profileRepository.count({
      where: {
        parent_user_id: parentUserId,
        is_active: true,
      },
    });
  }

  async update(id: number, profile: Partial<Profile>): Promise<Profile | null> {
    await this.profileRepository.update(id, profile);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.profileRepository.delete(id);
    return result.affected != undefined && result.affected > 0;
  }

  async deleteByChildUserId(childUserId: number): Promise<boolean> {
    const result = await this.profileRepository.delete({
      child_user_id: childUserId,
    });

    return result.affected !== undefined;
  }

  async linkChildUser(
    profileId: number,
    childUserId: number,
  ): Promise<Profile | null> {
    await this.profileRepository.update(profileId, {
      child_user_id: childUserId,
    });
    return await this.findById(profileId);
  }

  async unlinkChildUser(profileId: number): Promise<Profile | null> {
    await this.profileRepository.update(profileId, {
      child_user_id: undefined,
    });
    return await this.findById(profileId);
  }

  async findActiveProfilesWithChildUsers(
    parentUserId: number,
  ): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        is_active: true,
        child_user_id: Not(IsNull()),
      },
      relations: ['child_user', 'child_user.consumer', 'child_user.influencer'],
    });
  }

  async findActiveProfilesWithoutChildUsers(
    parentUserId: number,
  ): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        is_active: true,
        child_user_id: undefined,
      },
    });
  }

  async deleteProfilyByIdAndParentId(profileId: number, parentId: number) {
    return this.profileRepository.delete({
      id: profileId,
      parent_user_id: parentId,
    });
  }

  async softDeleteProfilyByIdAndParentId(profileId: number, parentId: number) {
    return this.profileRepository.softDelete({
      id: profileId,
      parent_user_id: parentId,
    });
  }

  async restoreSoftDeleteProfilyByIdAndParentId(
    profileId: number,
    parentId: number,
  ) {
    return this.profileRepository.restore({
      id: profileId,
      parent_user_id: parentId,
    });
  }

  async restoreSoftDeleteProfilyById(profileId: number) {
    return this.profileRepository.restore({ id: profileId });
  }

  async isChildUser(userId: number): Promise<boolean> {
    return await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.child_user_id = :userId', { userId })
      .getExists();
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    return await this.profileRepository.save(profile);
  }

  async findSoftDeletedByParentUserId(
    parentUserId: number,
  ): Promise<Profile[]> {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        deletedAt: And(Not(IsNull()), MoreThanOrEqual(tenDaysAgo)),
      },
      relations: [
        'child_user',
        'parent_user',
        'child_user.consumer',
        'child_user.influencer',
        'parent_user.consumer',
        'parent_user.influencer',
      ],
      order: { deletedAt: 'DESC' },
      withDeleted: true,
    });
  }

  async findSoftDeletedByChildUserId(
    childUserId: number,
  ): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: {
        child_user_id: childUserId,
        deletedAt: Not(IsNull()), // Only soft-deleted records
      },
      relations: [
        'child_user',
        'parent_user',
        'child_user.consumer',
        'child_user.influencer',
        'parent_user.consumer',
        'parent_user.influencer',
      ],
      withDeleted: true, // Include soft-deleted records
    });
  }

  async findAllNormalAndDeletedById(id: number): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: { id },
      relations: [
        'parent_user',
        'child_user',
        'child_user.consumer',
        'child_user.consumer.measurement',
        'child_user.influencer',
        'parent_user.consumer',
        'parent_user.influencer',
      ],
      withDeleted: true,
    });
  }
  async countActiveSiblingsByChildUserId(
    childUserId: number,
  ): Promise<number | null> {
    const profile = await this.findSoftDeletedByChildUserId(childUserId);
    if (!profile || !profile.parent_user_id) {
      return 0;
    }

    return await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.parent_user_id = :parentUserId', {
        parentUserId: profile.parent_user_id,
      })
      .andWhere('profile.deletedAt IS NULL')
      .getCount();
  }
}
