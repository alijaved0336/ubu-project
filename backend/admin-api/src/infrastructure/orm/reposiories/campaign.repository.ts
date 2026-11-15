// campaign.repository.ts
import { ICampaignRepository } from '@domain/repository/campaign.repository.interface';
import { CampaignStatus } from '@infrastructure/utils/constant';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Not, QueryRunner, Repository } from 'typeorm';
import { Campaign } from '../entities/campaign.entity';
import { User } from '../entities/user.entity';

export class CampaignRepository implements ICampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async findCampaignById(id: number): Promise<Campaign | undefined> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['segments', 'brand', 'brand.user', 'influencer.user', 'reviews'],
    });

    return campaign || undefined;
  }

  async findByStatus(status: string): Promise<Campaign[]> {
    return this.campaignRepository.createQueryBuilder('campaign').where('campaign.status = :status', { status }).getMany();
  }

  async findBySegmentId(segmentId: number): Promise<Campaign[]> {
    return this.campaignRepository.createQueryBuilder('campaign').where('campaign.segmentId = :segmentId', { segmentId }).getMany();
  }

  async getCampaignRelatedBrandAndInfluencerUser(campaignId: number): Promise<{ brandUser: User | null; influencerUser: User | null }> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: ['brand.user', 'influencer.user'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    const brandUser = campaign.brand?.user || null;
    const influencerUser = campaign.influencer?.user || null;

    return { brandUser, influencerUser };
  }

  async findActiveCampaigns(): Promise<Campaign[]> {
    return this.findByStatus('active');
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignRepository.find({
      relations: ['segments', 'brand', 'influencer.user'],
    });
  }

  async findCampaignByBrand(startDate, endDate) {
    const [campaigns, total] = await this.campaignRepository.findAndCount({
      where: {
        created_at: Between(startDate, endDate),
        status: Not(CampaignStatus.REJECTED),
      },
      order: {
        id: 'DESC',
      },
    });
    return { campaigns, total };
  }

  async findByBrands(brand_id: number, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = { brand: { id: brand_id } } as any;

    if (search) {
      whereCondition = [
        { brand: { id: brand_id, brand_name: ILike(`%${search}%`) } },
        {
          brand: { id: brand_id },
          influencer: { user: { first_name: ILike(`%${search}%`) } },
        },
        {
          brand: { id: brand_id },
          influencer: { user: { last_name: ILike(`%${search}%`) } },
        },
        { brand: { id: brand_id }, segments: { name: ILike(`%${search}%`) } },
      ];
    }

    const [campaigns, total] = await this.campaignRepository.findAndCount({
      relations: [
        'segments',
        'brand',
        'influencer.user',
        'reviews',
        'reviews.reviewerBrand',
        'reviews.reviewerBrand.user',
        'reviews.reviewerInfluencer',
        'reviews.reviewerInfluencer.user',
        'exhibitDocuments',
      ],
      where: whereCondition,
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    campaigns.forEach((campaign) => {
      if (campaign.exhibitDocuments && campaign.exhibitDocuments.length > 0) {
        campaign.exhibitDocuments.sort((a, b) => b.documentOrder - a.documentOrder);
        campaign.exhibitDocuments = [campaign.exhibitDocuments[0]];
      }
    });

    return { campaigns, total };
  }

  async findByInfluencer(influencer_id: number, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = { influencer: { id: influencer_id } } as any;

    if (search) {
      whereCondition = [
        {
          influencer: { id: influencer_id },
          description: ILike(`%${search}%`),
        },
        {
          influencer: { id: influencer_id },
          brand: { brand_name: ILike(`%${search}%`) },
        },
        {
          influencer: {
            id: influencer_id,
            user: { first_name: ILike(`%${search}%`) },
          },
        },
        {
          influencer: {
            id: influencer_id,
            user: { last_name: ILike(`%${search}%`) },
          },
        },
        {
          influencer: { id: influencer_id },
          segments: { name: ILike(`%${search}%`) },
        },
      ];
    }

    const [campaigns, total] = await this.campaignRepository.findAndCount({
      relations: [
        'segments',
        'brand',
        'influencer.user',
        'reviews',
        'reviews.reviewerInfluencer',
        'reviews.reviewerInfluencer.user',
        'reviews.reviewerBrand',
        'reviews.reviewerBrand.user',
        'exhibitDocuments',
      ],
      where: whereCondition,
      skip: skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    campaigns.forEach((campaign) => {
      if (campaign.exhibitDocuments && campaign.exhibitDocuments.length > 0) {
        campaign.exhibitDocuments.sort((a, b) => b.documentOrder - a.documentOrder);
        campaign.exhibitDocuments = [campaign.exhibitDocuments[0]];
      }
    });

    return { campaigns, total };
  }

  async findInfluencerByBrandId(id: number) {
    return this.campaignRepository.find({
      where: { brand: { id } },
      relations: { influencer: true },
    });
  }

  async updateCampaignStatus(campaignId: number, newStatus: CampaignStatus, queryRunner?: QueryRunner) {
    const campaignRepo = queryRunner ? queryRunner.manager.getRepository(Campaign) : this.campaignRepository;
    const campaign = await campaignRepo.findOne({ where: { id: campaignId } });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    campaign.status = newStatus;
    return campaignRepo.save(campaign);
  }

  async isUserAssociatedWithCampaign(campaignId: number, userId: number): Promise<boolean> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: ['brand.user', 'influencer.user'],
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
    }

    // Check if the user is the brand or influencer
    const isBrand = campaign.brand?.user?.id === userId;
    const isInfluencer = campaign.influencer?.user?.id === userId;
    return isBrand || isInfluencer;
  }

  create(data: Partial<Campaign>): Campaign {
    return this.campaignRepository.create(data);
  }

  async save(campaign: Campaign, queryRunner?: QueryRunner): Promise<Campaign> {
    return queryRunner ? await queryRunner.manager.getRepository(Campaign).save(campaign) : await this.campaignRepository.save(campaign);
  }

  async update(id: number, campaign: Partial<Campaign>, queryRunner?: QueryRunner): Promise<Campaign | null> {
    const repo = queryRunner ? queryRunner.manager.getRepository(Campaign) : this.campaignRepository;
    await repo.update(id, campaign);
    return repo.findOneBy({ id });
  }

  async getOneWithLatestDocument(id: number) {
    return await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.exhibitDocuments', 'exhibitDocument')
      .leftJoinAndSelect('exhibitDocument.product', 'product')
      .leftJoinAndSelect('campaign.segments', 'segment')
      .leftJoinAndSelect('campaign.campaignDisputes', 'campaignDisputes')
      .leftJoinAndSelect('campaignDisputes.raised_by', 'raised_by_user')
      .leftJoinAndSelect('campaign.brand', 'brand')
      .leftJoinAndSelect('campaign.influencer', 'influencer')
      .leftJoinAndSelect('campaign.reviews', 'review')
      .leftJoinAndSelect('review.reviewerBrand', 'reviewerBrand')
      .leftJoinAndSelect('reviewerBrand.user', 'reviewerBrandUser')
      .leftJoinAndSelect('review.reviewerInfluencer', 'reviewerInfluencer')
      .leftJoinAndSelect('reviewerInfluencer.user', 'reviewerInfluencerUser')
      .where('campaign.id = :id', { id })
      .orderBy('exhibitDocument.document_order', 'DESC')
      .getOne();
  }

  // all of my campaigns against which i have not submit review
  async completedCompaignsWithoutReviewByInfluencer(influencerId: number): Promise<Campaign[]> {
    return this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.reviews', 'review', 'review.reviewer_id = :influencerId', { influencerId: influencerId })
      .where('campaign.influencer_id = :influencerId', {
        influencerId: influencerId,
      })
      .andWhere('campaign.review_notify_count >= :minNotifyCount', {
        minNotifyCount: 5,
      })
      .andWhere('campaign.status = :status', { status: 'completed' })
      .andWhere('review.id IS NULL')
      .getMany();
  }

  // all of the campaigns where reviewNotifyCount is greater than 5
  async completedCampaignsWithHighNotifyReviewCount(influencerId: number): Promise<Campaign[]> {
    return this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.influencer_id = :influencerId', { influencerId })
      .andWhere('campaign.status = :status', { status: 'completed' })
      .andWhere('campaign.review_notify_count >= :minNotifyCount', {
        minNotifyCount: 5,
      })
      .getMany();
  }

  // all of the campaigns where there is only 1 review
  async findCompletedCampaignsWithoutInfluencerReview() {
    return await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.segments', 'segment')
      .leftJoinAndSelect('campaign.brand', 'brand')
      .leftJoinAndSelect('brand.user', 'brandUser')
      .leftJoinAndSelect('campaign.influencer', 'influencer')
      .leftJoinAndSelect('influencer.user', 'influencerUser')
      .leftJoinAndSelect('campaign.reviews', 'review')
      .where('campaign.status = :status', { status: 'completed' })
      .andWhere(
        'campaign.id IN (' +
          this.campaignRepository
            .createQueryBuilder('subCampaign')
            .select('subCampaign.id')
            .leftJoin('subCampaign.reviews', 'subReview')
            .groupBy('subCampaign.id')
            .having('COUNT(subReview.id) = 1')
            .getQuery() +
          ')',
      )
      .getMany();
  }

  async findActiveBySegmentId(segmentId: number): Promise<Campaign[]> {
    return this.campaignRepository.createQueryBuilder('campaign').where('campaign.segmentId = :segmentId', { segmentId }).andWhere('campaign.status != :status', { status: 'pending' }).getMany();
  }

  async deleteBySegment(segmentId: number) {
    return this.campaignRepository.delete({ segments: { id: segmentId } });
  }
}
