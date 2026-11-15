import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { IInfluencerRepository } from '@domain/repository/influencer.repository.interface';
import { Influencers } from '../entities/influencer.entity';
import { PostRepository } from './post.repository';
import { Proposal } from '../entities/proposals.entity';
import { ParsedBodyShapeAnswersFilter, ParsedBudgetAnswersFilter, ParsedHobbiesAnswersFilter, ParsedLocationAnswersFilter, ParsedMeasurementFilter, ParsedSportsAnswersFilter, ParsedStylesAnswersFilter } from '@infrastructure/presentation/influencer/influencer.dto';

@Injectable()
export class InfluencerRepository implements IInfluencerRepository {
  constructor(
    @InjectRepository(Influencers)
    private readonly influencerRepository: Repository<Influencers>,

    private readonly postRepository: PostRepository,

    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,

  ) { }

  async findInfluencerById(id: number){
    return this.influencerRepository.findOne({where: {id}});
  }

  async softDeleteInfluencerById(id: number){
    return this.influencerRepository.softDelete({id});
  }

  async deleteInfluencerById(id: number){
    return this.influencerRepository.delete({id});
  }

  async restoreSoftDeleteInfluencerById(id: number){
    return this.influencerRepository.restore({id});
  }

  async influncerProfile(id: number): Promise<Influencers | null> {
    const influencer = await this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoinAndSelect('influencer.user', 'user')
      .leftJoinAndSelect('influencer.measurement', 'measurement')
      .leftJoinAndSelect('user.user_answer', 'user_answer')
      .leftJoinAndSelect('user_answer.question', 'question')
      .where('influencer.id = :id', { id })
      .getOne();
    return influencer;
  }

  async getRecommendedInfluncerProfileById(ids: number[]) {
    const influncers = await this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoin('influencer.user', 'user')
      .select([
        'influencer.id',
      ])
      .addSelect("influencer.avatar", 'user_avatar')
      .addSelect("user.first_name", 'first_name')
      .addSelect("user.last_name", 'last_name')
      .addSelect("user.id", 'user_id')
      .where('user.id IN (:...ids)', { ids })
      .getRawMany();
    return influncers
  }

  async getRecommendedInfluncerProfileBymeasurementId(ids: number[]) {
    return this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoin('influencer.user', 'user')
      .leftJoin('influencer.measurement', 'measurement')
      .select([
        'influencer.id',
      ])
      .addSelect("influencer.avatar", 'user_avatar')
      .addSelect("user.first_name", 'first_name')
      .addSelect("user.last_name", 'last_name') 
      .addSelect("measurement.id", 'measurement_id')
      .where('measurement.id IN (:...ids)', { ids })
      .getRawMany();
  }

  async getRecommendedInfluncerProfileIds(ids: number[]) {
    return this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoin('influencer.user', 'user')
      .select([
        'influencer.id',
      ])
      .addSelect("influencer.avatar", 'user_avatar')
      .addSelect("user.first_name", 'first_name')
      .addSelect("user.last_name", 'last_name')
      .where('influencer.id IN (:...ids)', { ids })
      .getRawMany();
  }

  async deleteInfluencerData(influencerId: number): Promise<void> {
    try
    {
      const deletedPostsCount =
        await this.postRepository.deletePostsByInfluencerId(influencerId);

        await this.proposalRepository?.delete({
          influencer: { id: influencerId },
        });

    } catch (error)
    {
      throw new Error(
        `Failed to delete data for influencer ID ${influencerId}: ${error.message}`,
      );
    }
  }

  async updateById(id: number, payload) {
    return await this.influencerRepository.update(id, payload);
  }

  async findInfluencersByIds(influencerIds: number[]) {
    return this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoinAndSelect('influencer.user', 'user')
      .leftJoinAndSelect('influencer.measurement', 'measurement')
      .where('influencer.id IN (:...influencerIds)', { influencerIds })
      .getMany();
  }

  async fetchFilteredInfluencers(
    measurementFilter?: ParsedMeasurementFilter, 
    budgetAnswersFilter?: ParsedBudgetAnswersFilter,
    stylesAnswersFilter?: ParsedStylesAnswersFilter,
    hobbiesAnswersFilter?: ParsedHobbiesAnswersFilter,
    sportsAnswersFilter?: ParsedSportsAnswersFilter,
    locationAnswersFilter?: ParsedLocationAnswersFilter,
    bodyShapeAnswersFilter?: ParsedBodyShapeAnswersFilter
  ) {
    const queryBuilder = this.influencerRepository
      .createQueryBuilder('influencer')
      .leftJoinAndSelect('influencer.measurement', 'measurement')
      .leftJoinAndSelect('influencer.user', 'user');

    queryBuilder.andWhere('influencer.deletedAt IS NULL');
    queryBuilder.andWhere('user.deletedAt IS NULL');

    let hasFilters = false;
    const filterConditions: string[] = [];
    const filterParameters: any = {};

    // Measurement filters
    if (
      measurementFilter?.minHeight || measurementFilter?.maxHeight ||
      measurementFilter?.minWeight || measurementFilter?.maxWeight
    ) {
      hasFilters = true;
      const measurementConditions: string[] = [];
      
      // Height conditions
      if (measurementFilter.minHeight && !measurementFilter.maxHeight) {
        measurementConditions.push("(measurement.input->'photoScan'->>'height')::int = :minHeight");
        filterParameters.minHeight = measurementFilter.minHeight;
      } else if (measurementFilter.maxHeight && !measurementFilter.minHeight) {
        measurementConditions.push("(measurement.input->'photoScan'->>'height')::int = :maxHeight");
        filterParameters.maxHeight = measurementFilter.maxHeight;
      } else if (measurementFilter.minHeight && measurementFilter.maxHeight) {
        measurementConditions.push("(measurement.input->'photoScan'->>'height')::int BETWEEN :minHeight AND :maxHeight");
        filterParameters.minHeight = measurementFilter.minHeight;
        filterParameters.maxHeight = measurementFilter.maxHeight;
      }

      // Weight conditions
      if (measurementFilter.minWeight && !measurementFilter.maxWeight) {
        measurementConditions.push("(measurement.input->'photoScan'->>'weight')::int = :minWeight");
        filterParameters.minWeight = measurementFilter.minWeight;
      } else if (measurementFilter.maxWeight && !measurementFilter.minWeight) {
        measurementConditions.push("(measurement.input->'photoScan'->>'weight')::int = :maxWeight");
        filterParameters.maxWeight = measurementFilter.maxWeight;
      } else if (measurementFilter.minWeight && measurementFilter.maxWeight) {
        measurementConditions.push("(measurement.input->'photoScan'->>'weight')::int BETWEEN :minWeight AND :maxWeight");
        filterParameters.minWeight = measurementFilter.minWeight;
        filterParameters.maxWeight = measurementFilter.maxWeight;
      }

      // Combine measurement conditions with AND (within measurement filter)
      if (measurementConditions.length > 0) {
        filterConditions.push(`(${measurementConditions.join(' AND ')})`);
      }
    }

    // Function to add answer-based filter conditions
    const addAnswerFilterCondition = (filter: ParsedBudgetAnswersFilter | ParsedStylesAnswersFilter | ParsedHobbiesAnswersFilter | ParsedSportsAnswersFilter | ParsedLocationAnswersFilter | ParsedBodyShapeAnswersFilter, paramPrefix: string) => {
      if (filter?.selectedOptions && filter.selectedOptions.length > 0) {
        hasFilters = true;

        const optionsArray = `ARRAY[${filter.selectedOptions.map((_, index) => `:${paramPrefix}${index}`).join(',')}]::text[]`;
        
        filter.selectedOptions.forEach((option, index) => {
          filterParameters[`${paramPrefix}${index}`] = option;
        });

        const condition = `EXISTS (
          SELECT 1 FROM user_answers ua 
          WHERE ua.user_id = user.id 
          AND ua.selected_options @> ${optionsArray} 
          AND ${optionsArray} @> ua.selected_options
        )`;
        
        filterConditions.push(condition);
      }
    };

    // Add all answer-based filter conditions
    if (budgetAnswersFilter) {
      addAnswerFilterCondition(budgetAnswersFilter, 'budgetOption');
    }

    if (stylesAnswersFilter) {
      addAnswerFilterCondition(stylesAnswersFilter, 'styleOption');
    }

    if (hobbiesAnswersFilter) {
      addAnswerFilterCondition(hobbiesAnswersFilter, 'hobbyOption');
    }

    if (sportsAnswersFilter) {
      addAnswerFilterCondition(sportsAnswersFilter, 'sportOption');
    }

    if (locationAnswersFilter) {
      addAnswerFilterCondition(locationAnswersFilter, 'locationOption');
    }

    if (bodyShapeAnswersFilter) {
      addAnswerFilterCondition(bodyShapeAnswersFilter, 'shapeOption');
    }

    // Apply the combined filter conditions with OR logic between different filter types
    if (hasFilters && filterConditions.length > 0) {
      queryBuilder.andWhere(`(${filterConditions.join(' OR ')})`, filterParameters);
    }
  
    return queryBuilder.getManyAndCount();
}
}