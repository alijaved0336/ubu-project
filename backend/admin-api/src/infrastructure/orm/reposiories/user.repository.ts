import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '@domain/repository/user.repository.interface';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { UserType } from '../entities/questionnaire.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private bcryptService: BcryptService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(payload: Partial<User>) {
    const user = this.userRepository.create(payload);
    return (await this.userRepository.save(user)) && user;
  }

  async save(user: Partial<User>) {
    return (await this.userRepository.save(user)) && 'User Successfully Created!';
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['influencer', 'consumer', 'brand', 'consumer.measurement', 'influencer.measurement'],
    });
  }

  async findConsumerByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['influencer', 'consumer', 'brand', 'consumer.measurement', 'influencer.measurement'],
    });
  }

  async findUserByEmail(email) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserByCondition(condition) {
    return this.userRepository.findOne({ where: condition });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['influencer', 'consumer', 'brand', 'consumer.measurement', 'influencer.measurement'],
    });
  }

  async findOne(email: string): Promise<User | undefined | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, payload: Partial<User>) {
    return this.userRepository.update(id, payload);
  }

  async findAll() {
    return this.userRepository.find({
      relations: {
        chatUsers: {
          chat: true,
        },
      },
      select: ['first_name', 'last_name', 'id'],
    });
  }

  async findAmazonInfluencers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const baseQB = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.influencer', 'influencer')
      .innerJoin('weekly_tracking_summaries', 'summary', 'summary.influencer_id = influencer.id')
      .leftJoin('user.influencerPayment', 'payment', 'payment.status = :status', { status: 'pending' })
      .leftJoin(
        'stripe_connected_accounts',
        'connectedAccounts',
        `connectedAccounts.influencer_id = influencer.id
       AND connectedAccounts.status = 'completed'`,
      )
      .where('user.is_influencer = :isInfluencer', { isInfluencer: true });

    if (search) {
      baseQB.andWhere(`(user.first_name ILIKE :search OR user.last_name ILIKE :search)`, { search: `%${search}%` });
    }

    const dataQB = baseQB
      .clone()
      .select([
        'user.id          AS user_id',
        'user.first_name  AS first_name',
        'user.last_name   AS last_name',
        'influencer.id    AS influencer_id',
        'SUM(summary.revenue)                         AS total_pending_revenue',
        'connectedAccounts.stripe_connected_account_id AS connected_account_id',
        'payment.amount                              AS pending_payment_amount',
      ])
      .groupBy('user.id')
      .addGroupBy('influencer.id')
      .addGroupBy('payment.amount')
      .addGroupBy('connectedAccounts.stripe_connected_account_id')
      // always specify a deterministic ORDER BY when paginating
      .orderBy('user.id', 'ASC')
      .offset(skip)
      .limit(limit);

    const data = await dataQB.getRawMany();

    const countRes = await baseQB.clone().select('COUNT(DISTINCT user.id)', 'cnt').getRawOne();
    const total = parseInt(countRes.cnt, 10);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findAllCampignInfluencersByBrandId(bid: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.influencer.avatar',
        'user.brand.avatar',
        'user.is_brand',
        'user.is_influencer',
        'user.is_consumer',
      ])
      .innerJoin('user.influencer', 'influencer')
      .innerJoin('influencer.campaigns', 'campaign')
      .innerJoin('campaign.brand', 'brand')
      .where('brand.id = :bid', { bid })
      .andWhere('user.is_influencer = :is_influencer', { is_influencer: true })
      .getMany();
  }

  async findAllCampignBrandByInfluencerId(id: number) {
    return this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.influencer.avatar',
        'user.brand.avatar',
        'user.is_brand',
        'user.is_influencer',
        'user.is_consumer',
      ])
      .innerJoin('user.brand', 'brand')
      .innerJoin('brand.campaigns', 'campaign')
      .innerJoin('campaign.influencer', 'influencer')
      .where('influencer.id = :id', { id })
      .andWhere('user.is_brand = :is_brand', { is_brand: true })
      .getMany();
  }

  async findUserByBrandId(bid: number) {
    return this.userRepository.findOneOrFail({
      where: { brand: { id: bid } },
      select: ['id', 'email', 'first_name', 'last_name'],
    });
  }

  async findUserByInfluencerId(infId: number) {
    return this.userRepository.findOne({
      where: { influencer: { id: infId } },
      select: ['id', 'email', 'first_name', 'last_name'],
    });
  }

  async isUserScanned(id) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.influencer', 'influencer').leftJoinAndSelect('influencer.measurement', 'measurement').where('user.id = :id', { id });
    const user = await queryBuilder.getOne();
    const hasMeasurement = user?.influencer?.measurement !== undefined && user?.influencer?.measurement !== null ? true : false;
    return hasMeasurement;
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    // Optionally hash the refresh token before storing
    const hashedToken = await this.bcryptService.encryptRefreshToken(refreshToken);

    // Save the hashed token to the user's record in the database
    await this.userRepository.update(userId, { refresh_token: hashedToken });
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
    return this.userRepository.save(user);
  }

  async findByEmailOrAppleIdentifier(email: string, apple_identifier): Promise<User | null> {
    const whereCondition: any[] = [{ email }];

    if (apple_identifier) {
      whereCondition.push({ apple_identifier });
    }

    return this.userRepository.findOne({
      where: whereCondition,
      relations: ['influencer', 'brand', 'consumer'],
    });
  }

  async getAllListOfUsers(skip = 0, take = 10, search?: string): Promise<{ users: User[]; totalCount: number }> {
    const whereCondition = search ? [{ first_name: ILike(`%${search}%`) }, { email: ILike(`%${search}%`) }, { city: ILike(`%${search}%`) }] : [];

    const [users, totalCount] = await this.userRepository.findAndCount({
      where: whereCondition.length ? whereCondition : undefined,
      skip,
      take,
      order: { created_at: 'DESC' },
      select: ['id', 'first_name', 'address', 'city', 'email', 'created_at'], // Exclude password
    });

    return { users, totalCount };
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

    if (userType === UserType.INFLUENCER && user.influencer) {
      return user.influencer.measurement?.measurements?.length > 30 || false;
    }

    if (userType === UserType.MINORINFLUENCER && user.influencer) {
      return user.influencer.measurement?.measurements?.length > 30 || false;
    }

    return false;
  }

  async findUsersByIds(userIds: number[]) {
    return this.userRepository.find({
      where: { id: In(userIds) },
    });
  }

  async findUserByConditionwithRelation(condition, relations = [], select = {}) {
    return this.userRepository.findOne({
      where: condition,
      relations,
      select,
    });
  }

  async removeRefreshToken(userId: number): Promise<{ statusCode: number; message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.refresh_token = '';
    await this.userRepository.save(user);

    return {
      statusCode: 200,
      message: 'Refresh token removed successfully',
    };
  }
}
