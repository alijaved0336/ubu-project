import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '@domain/repository/user.repository.interface';
import { Consumers } from '../entities/consumer.entity';
import { Influencers } from '../entities/influencer.entity';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { UserType } from '../entities/questionnaire.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private bcryptService: BcryptService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Consumers)
    private readonly consumerRepository: Repository<Consumers>,

    @InjectRepository(Influencers)
    private readonly influencerRepository: Repository<Influencers>,
  ) {}

  async create(userPayload) {
    const { avatar, ...payload } = userPayload;
    if (payload?.email) {
      payload.email = payload.email.toLocaleLowerCase();
    }
    payload.is_consumer = true;
    const user = this.userRepository.create(payload);
    const savedUser = await this.userRepository.save(user);

    const createdConsumer = this.consumerRepository.create({
      user: { id: savedUser['id'] },
      avatar,
    });
    await this.consumerRepository.save(createdConsumer);

    return savedUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    email = email.toLocaleLowerCase();
    return this.userRepository.findOne({
      where: { email },
      relations: ['influencer', 'consumer', 'consumer.measurement'],
    });
  }
  async findInfluncerByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['influencer', 'consumer', 'influencer.measurement'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: [
        'influencer',
        'consumer',
        'consumer.measurement',
        'childProfile',
      ],
    });
  }
  async findDeletedAndNonDeletedById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: [
        'influencer',
        'consumer',
        'consumer.measurement',
        'childProfile',
      ],
      withDeleted: true,
    });
  }

  async findUserByInfluencerId(id: number) {
    return this.userRepository.findOne({ where: { influencer: { id } } });
  }

  async getSimilarHeightInfluencers(
    select: string[],
    condition: string,
    targetHeight: number,
    limit: number,
    page: number,
  ) {
    return this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoinAndSelect('influencer.user', 'user')
      .innerJoinAndSelect('influencer.measurement', 'measurement')
      .where(condition)
      .select(select)
      .setParameter('targetHeight', targetHeight)
      .orderBy('height_diff')
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();
  }

  async isUserScanned(id) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .leftJoinAndSelect('user.consumer', 'consumer')
      .leftJoinAndSelect('consumer.measurement', 'measurement')
      .where('user.id = :id', { id });
    const user = await queryBuilder.getOne();
    const hasMeasurement =
      user?.consumer?.measurement !== undefined &&
      user?.consumer?.measurement !== null
        ? true
        : false;
    return hasMeasurement;
  }

  async removeUser(user_id) {
    return this.userRepository.delete({ id: user_id });
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    // Optionally hash the refresh token before storing
    const hashedToken =
      await this.bcryptService.encryptRefreshToken(refreshToken);

    // Save the hashed token to the user's record in the database
    await this.userRepository.update(userId, { refresh_token: hashedToken });
  }

  async updateUser(user_id, payload) {
    return this.userRepository.update(user_id, payload);
  }

  async save(user: Partial<User>) {
    return (
      (await this.userRepository.save(user)) && 'User Successfully Created!'
    );
  }

  async deleteUserPartially(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.is_deleted = true;
    user.first_name = `${user.first_name} (in-active)`;
    user.email = `deleted_user_${user.email}`;
    await this.userRepository.save(user);
    return this.userRepository.softDelete({ id: user.id });
  }
  async isUserScannedForCurrentUserType(userId: number, userType: UserType) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.influencer', 'influencer')
      .leftJoinAndSelect('user.consumer', 'consumer')
      .leftJoinAndSelect('influencer.measurement', 'influencerMeasurement')
      .leftJoinAndSelect('consumer.measurement', 'consumerMeasurement')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      return false;
    }

    if (userType === UserType.CONSUMER && user.consumer) {
      return user.consumer.measurement?.measurements?.length > 30 || false;
    }

    if (userType === UserType.MINORCONSUMER && user.consumer) {
      return user.consumer.measurement?.measurements?.length > 30 || false;
    }

    if (userType === UserType.INFLUENCER && user.influencer) {
      return user.influencer.measurement?.measurements?.length > 30 || false;
    }

    return false;
  }
  async revertUserPartially(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        withDeleted: true, // Include soft-deleted records
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      user.is_deleted = false;

      // Remove "(in-active)" suffix from first_name if it exists
      if (user.first_name && user.first_name.includes('(in-active)')) {
        user.first_name = user.first_name.replace(' (in-active)', '').trim();
      }

      // Remove "deletedUser_" prefix from email if it exists
      if (user.email && user.email.startsWith('deleted_user_')) {
        user.email = user.email.replace('deleted_user_', '');
      }

      await this.userRepository.save(user);
      return await this.userRepository.restore({ id: userId });
    } catch (error) {
      throw new Error(
        `Failed to revert user with ID ${userId}: ${error.message}`,
      );
    }
  }

  async searchUsers(
    searchString: string,
    limit: number,
    page: number,
    loggedInUserId: number,
  ): Promise<[User[], number]> {
    const subQuery = this.userRepository
      .createQueryBuilder('sub_user')
      .select('sub_user.id')
      .innerJoin('profile', 'p', 'p.child_user_id = sub_user.id')
      .where('p.deletedAt IS NULL');

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.consumer', 'consumer')
      .leftJoinAndSelect('user.influencer', 'influencer')
      .leftJoin('profile', 'profile', 'profile.child_user_id = user.id')
      .where('user.is_brand = false')
      .andWhere('user.deletedAt IS NULL')
      .andWhere('user.id != :loggedInUserId', { loggedInUserId })
      .andWhere(`user.id NOT IN (${subQuery.getQuery()})`)
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'profile.isDependant = false OR profile.isDependant IS NULL',
          );
        }),
      )
      .setParameters(subQuery.getParameters())
      .andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.first_name) LIKE LOWER(:search)', {
            search: `%${searchString}%`,
          })
            .orWhere('LOWER(user.last_name) LIKE LOWER(:search)', {
              search: `%${searchString}%`,
            })
            .orWhere('LOWER(user.email) LIKE LOWER(:search)', {
              search: `%${searchString}%`,
            })
            .orWhere(
              "LOWER(CONCAT(user.first_name, ' ', user.last_name)) LIKE LOWER(:search)",
              {
                search: `%${searchString}%`,
              },
            )
            .orWhere(
              'LOWER(CONCAT(user.first_name, user.last_name)) LIKE LOWER(:search)',
              {
                search: `%${searchString}%`,
              },
            );
        }),
      )
      .orderBy('user.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, total] = await query.getManyAndCount();
    return [users, total];
  }
}
