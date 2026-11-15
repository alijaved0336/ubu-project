import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository, UpdateResult } from 'typeorm';
import { IInfluencerRepository } from '@domain/repository/influencer.repository.interface';
import { Influencers } from '../entities/influencer.entity';
import { Brackets } from 'typeorm';
import { BodyMeasurement } from '../entities/body-measurement.entity';
import { Campaign } from '../entities/campaign.entity';
import { PostRepository } from './post.repository';
import { ProposalRepository } from './proposal.repository';
import { UserRepository } from './user.repository';
import { Profile } from '../entities/profile.entity';
import axios from 'axios';
import { NotificationRepository } from './notification.repository';
import { User } from '@sentry/nestjs';
import { QuestionnaireRepository } from './questionnaire.repository';
import { UserType } from '../entities/questionnaire.entity';

@Injectable()
export class InfluencerRepository implements IInfluencerRepository {
  constructor(
    @InjectRepository(Influencers)
    private readonly influencerRepository: Repository<Influencers>,

    @InjectRepository(BodyMeasurement)
    private readonly bodyRepository: Repository<BodyMeasurement>,

    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,

    private readonly postRepository: PostRepository,

    private readonly proposalRepository: ProposalRepository,

    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly questionnaireRepository: QuestionnaireRepository,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async create(payload: DeepPartial<Influencers>): Promise<Influencers> {
    const created_influencer = this.influencerRepository.create(payload);

    return (await this.influencerRepository.save(created_influencer)) && created_influencer;
  }

  async update(id: number, data: Partial<Influencers>): Promise<UpdateResult> {
    return this.influencerRepository.update(id, data);
  }

  async findInfluencerReviewsByInfluencerId(id: number): Promise<Influencers | null> {
    return await this.influencerRepository.findOne({
      where: { id },
      relations: ['reviewsReceived', 'reviewsReceived.reviewerBrand', 'reviewsReceived.reviewerBrand.user'],
    });
  }

  async createIfNotExsist(user_id, payload) {
    const influencer = await this.influencerRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });

    if (influencer) {
      if (!influencer?.measurement) {
        await this.updateById(influencer.id, {
          measurement_id: payload.measurement.id,
        });
      }
    }
    if (!influencer) {
      const created_influencer = this.influencerRepository.create(payload);
      return (await this.influencerRepository.save(created_influencer)) && created_influencer;
    }
    await this.userRepository.update(user_id, { is_influencer: true });
    return false;
  }

  async findOne(id: number): Promise<Influencers | null> {
    return await this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoinAndSelect('influencer.user', 'user')
      .leftJoinAndSelect('influencer.campaigns', 'campaigns')
      .leftJoinAndSelect('influencer.measurement', 'measurement')
      .leftJoinAndSelect('influencer.instagramStats', 'instagramStats')
      .leftJoinAndSelect('user.parentProfiles', 'profilesOfParentUser')
      .leftJoinAndSelect('user.childProfile', 'profileOfChildUser')
      .leftJoinAndSelect('user.user_answer', 'user_answer')
      .leftJoinAndSelect('user_answer.question', 'question')
      .where('influencer.id = :id', { id })
      .getOne();
  }

  async influncerProfile(influencer_id: number) {
    return await this.influencerRepository.findOne({
      where: { id: influencer_id },
      relations: ['measurement', 'user', 'user.user_answer', 'user.user_answer.question'],
    });
  }

  async findManyByIds(ids: number[]): Promise<Influencers[]> {
    return await this.influencerRepository.find({
      where: { id: In(ids) },
      relations: ['user', 'campaigns', 'instagramStats'],
    });
  }

  async findByUserId(user_id) {
    return this.influencerRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
      relations: ['measurement', 'user', 'user.consumer'],
    });
  }

  async findAll(): Promise<Influencers[]> {
    return await this.influencerRepository.find({
      relations: ['user', 'instagramStats'],
    });
  }

  async findOneByEmail(email: string) {
    return await this.influencerRepository
      .createQueryBuilder('influencer')
      .innerJoinAndSelect('influencer.user', 'user') // Join with the user table
      .where('user.email = :email', { email }) // Condition on user.email
      .getOne(); // Fetch one record
  }

  async is_body_measurment(influencer_id) {
    const bodyMeasurement = await this.bodyRepository.findOne({
      where: { influencer: { id: influencer_id } },
      relations: ['influencer'],
    });

    return bodyMeasurement;
  }

  async findInfluncerByUserId(id: number): Promise<Influencers | null> {
    return await this.influencerRepository.findOne({ where: { user: { id } } });
  }

  async saveMeasurements(payload) {
    // Create an instance of the entity
    const created_influencer = await this.bodyRepository.create(payload);

    // Save the created entity to the database
    return await this.bodyRepository.save(created_influencer);
  }

  async updateById(id: number, payload) {
    return await this.influencerRepository.update(id, payload);
  }

  async findInfluencersByIds(ids: number[]) {
    return await this.influencerRepository.find({
      where: { id: In(ids) },
      relations: ['user'],
    });
  }

  async findFilteredByIds(ids: number[]) {
    let query = this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoin('influencer.user', 'user')
      .leftJoin('user.user_answer', 'user_answers')
      .leftJoin('influencer.campaigns', 'campaigns')
      .select([
        'influencer.id',
        'user.id',
        'user.influencer.avatar',
        'user.first_name',
        'user.last_name',

        'campaigns.id',
        'campaigns.status',
        'campaigns.influencerId',
        'campaigns.brandId',
        'campaigns.segmentId',

        'user_answers.selected_options',
      ])
      .where('user.is_influencer = :isInfluencer', { isInfluencer: true })
      .where('influencer.id IN (:...influencer_user_ids)', {
        influencer_user_ids: ids,
      });
    query = query.andWhere('user_answers.question_id = :questionId', {
      questionId: 257,
    });

    return query.getMany();
  }

  async findInfluencersByFilters(filters: Record<string, any>, questionIdMap, segmentQuestionIds) {
    let query = this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoin('influencer.user', 'user')
      .select(['influencer.id', 'user.id', 'influencer.avatar', 'user.first_name', 'user.last_name'])
      .where('user.is_influencer = :isInfluencer', { isInfluencer: true });

    segmentQuestionIds.forEach((segmentQuestionId) => {
      const influencerQuestionId = questionIdMap[segmentQuestionId.toString()];
      filters[segmentQuestionId];

      if (filters[segmentQuestionId] && filters[segmentQuestionId].length > 0) {
        const questionParam = `question_id_${segmentQuestionId}`;
        const titleValueParam = `titleValue_${segmentQuestionId}`;

        query = query.andWhere(
          new Brackets((qb) => {
            qb.where(
              `EXISTS (
              SELECT 1
              FROM "user_answers" "ua"
              WHERE "ua"."user_id" = "user"."id"
                AND "ua"."question_id" = :${questionParam}
                AND "ua"."selected_options" && ARRAY[:...${titleValueParam}]::text[]
            )`,
              {
                [questionParam]: influencerQuestionId,
                [titleValueParam]: filters[segmentQuestionId],
              },
            );
          }),
        );
      }
    });

    return query.getMany();
  }

  async findPaginatedInfluencersByFilters(filters: Record<string, any>, questionIdMap, segmentQuestionIds, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    let query = this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoin('influencer.user', 'user')
      .leftJoin('user.user_answer', 'user_answers')
      .leftJoin('influencer.campaigns', 'campaigns')

      .select([
        'influencer.id',
        'user.id',
        'influencer.avatar',
        'user.first_name',
        'user.last_name',

        'campaigns.id',
        'campaigns.status',
        'campaigns.influencerId',
        'campaigns.brandId',
        'campaigns.segmentId',

        'user_answers.selected_options',
      ])
      .where('user.is_influencer = :isInfluencer', { isInfluencer: true });

    segmentQuestionIds.forEach((segmentQuestionId) => {
      const influencerQuestionId = questionIdMap[segmentQuestionId.toString()];

      if (filters[segmentQuestionId] && filters[segmentQuestionId].length > 0) {
        const questionParam = `question_id_${segmentQuestionId}`;
        const titleValueParam = `titleValue_${segmentQuestionId}`;

        query = query.andWhere(
          new Brackets((qb) => {
            qb.where(
              `EXISTS (
              SELECT ${segmentQuestionId}
              FROM "user_answers" "ua"
              WHERE "ua"."user_id" = "user"."id"
                AND "ua"."question_id" = :${questionParam}
                AND "ua"."selected_options" && ARRAY[:...${titleValueParam}]::text[]
            )`,
              {
                [questionParam]: influencerQuestionId,
                [titleValueParam]: filters[segmentQuestionId],
              },
            );
          }),
        );
      }
    });

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.first_name ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('user.last_name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    query = query.skip(skip).take(limit);

    const [influencers, total] = await query.getManyAndCount();

    return {
      influencers,
      total,
    };
  }

  async findMeasurementsByInfluencerId(id: number) {
    return this.bodyRepository.findOne({ where: { influencer: { id } } });
  }

  async getInfluencerCampaigns(influencerId: number) {
    const campaigns = await this.campaignRepository.find({
      where: { influencer: { id: influencerId } },
      select: ['brandId'],
    });

    return campaigns.map((campaign) => campaign.brandId);
  }

  async deleteInfluencerData(influencerId: number): Promise<void> {
    try {
      const deletedPostsCount = await this.postRepository.deletePostsByInfluencerId(influencerId);
      await this.proposalRepository.deleteProposalsByInfluencerdId(influencerId);
      console.log(`Deleted ${deletedPostsCount} posts for influencer ID ${influencerId}`);
    } catch (error) {
      throw new Error(`Failed to delete data for influencer ID ${influencerId}: ${error.message}`);
    }
  }

  async save(createdInfluencer: DeepPartial<Influencers>): Promise<Influencers> {
    return await this.influencerRepository.save(createdInfluencer);
  }

  async findParentUserByInfluencerId(childInfluencerId: number): Promise<Influencers | null> {
    const childInfluencer = await this.influencerRepository.findOne({
      where: { id: childInfluencerId },
      relations: { user: true },
    });
    if (!childInfluencer || !childInfluencer.user) {
      throw new NotFoundException('Child influencer or associated user not found.');
    }
    const childUserId = childInfluencer.user.id;
    const childProfile = await this.profileRepo.findOne({
      where: { child_user_id: childUserId },
    });

    if (!childProfile) {
      return null;
    }

    if (!childProfile.parent_user_id || childProfile.isDependant === false) {
      return null;
    }
    const parentInfluencer = await this.influencerRepository.findOne({
      where: { user: { id: childProfile.parent_user_id } },
    });

    return parentInfluencer ?? null;
  }

  async getRecommendedConsumersByUserIds(userIds: number[]): Promise<User[]> {
    return this.userRepository.findUsersByIds(userIds);
  }

  async similarQuestionerConsumersSendNotifications(consumerData, userId: number) {
    try {
      const url = `${process.env.PYTHON_SERVER_URL}/consumer-recommendation/from-questionnaire/?page=0&page_size=1000`;
      const headers = { 'Content-Type': 'application/json' };

      const userAnswers = await this.questionnaireRepository.findAllQuestionnairesWithAnswersForUser(userId, UserType.CONSUMER);
      const mappedData = userAnswers
        ?.flatMap(
          (q) =>
            q.user_answer?.map((ua) => ({
              sr_no: q.sr_no,
              question_id: q.id,
              answer: ua.selected_options,
            })) || [],
        )
        .filter(Boolean);

      if (!mappedData?.length) return [];
      const { data: response_data } = await axios.post(url, { payload: mappedData }, { headers, timeout: 10000 });
      if (!response_data.length) return [];
      const users = await this.getRecommendedConsumersByUserIds(response_data);
      if (!users) return [];
      await Promise.all(
        users
          .filter((u) => u && u.id)
          .map(async (user) => {
            const alreadyExists = await this.notificationRepository.findLastNotification({
              receiverId: userId,
              senderId: Number(user.id),
              type: 'MATCHED_CONSUMER',
            });

            if (!alreadyExists) {
              const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
              await this.notificationRepository.sendNotificationToUserDevices({
                receiverUserId: userId,
                receiverUserType: 'CONSUMER',
                senderUserId: Number(user.id),
                senderUserType: 'INFLUENCER',
                title: 'Influencer Match Found',
                body: `You have a new Influencer match: ${fullName}`,
                content: `You have a new Influencer match: ${fullName}`,
                type: 'MATCHED_CONSUMER',
                saveToDatabase: true,
              });
            }
          }),
      );

      return 'Notifications sent successfully';
    } catch (error) {
      console.log('Error in similarQuestionerConsumersSendNotifications:', error);
      return 'Error sending notifications';
    }
  }
}
