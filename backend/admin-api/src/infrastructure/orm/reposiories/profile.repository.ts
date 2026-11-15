import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { CreateProfileDto } from '@infrastructure/presentation/profile/profile.dto';

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
      relations: ['parent_user', 'child_user'],
    });
  }

  async findByParentUserId(parentUserId: number, is_active): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        is_active: is_active,
      },
      relations: ['child_user','parent_user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByChildUserId(childUserId: number): Promise<Profile | null> {
    return await this.profileRepository.findOne({
      where: {
        child_user_id: childUserId,
      },
      relations: ['parent_user', 'child_user'],
    });
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

  async linkChildUser(profileId: number, childUserId: number): Promise<Profile | null> {
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

  async findActiveProfilesWithChildUsers(parentUserId: number): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        is_active: true,
        child_user_id: Not(IsNull()),
      },
      relations: ['child_user'],
    });
  }

  async findActiveProfilesWithoutChildUsers(parentUserId: number): Promise<Profile[]> {
    return await this.profileRepository.find({
      where: {
        parent_user_id: parentUserId,
        is_active: true,
        child_user_id: undefined,
      },
    });
  }

  async deleteProfilyByIdAndParentId(profileId: number, parentId: number){
    return this.profileRepository.delete({id: profileId, parent_user_id: parentId})
  }

  async isChildUser(userId: number): Promise<boolean> {
    return await this.profileRepository.createQueryBuilder('profile')
      .where('profile.child_user_id = :userId', { userId })
      .getExists();
  }

}
