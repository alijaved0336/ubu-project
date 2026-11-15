import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { FollowRepository } from '@infrastructure/orm/reposiories/follow.repository';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import {
  BUDGET_QUESTIONS_SR_NO,
  STYLE_QUESTIONS_SR_NO,
} from 'common/constants';
import axios from 'axios';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import { ProposalRepository } from '@infrastructure/orm/reposiories/proposal.repository';
import { AffiliateProductRepository } from '@infrastructure/orm/reposiories/affiliate-product.repository';
import { MeasurementFilter, ParsedMeasurementFilter, ParsedBudgetAnswersFilter, BudgetAnswersFilter, StylesAnswersFilter, HobbiesAnswersFilter, SportsAnswersFilter, LocationAnswersFilter, BodyShapeAnswersFilter, ParsedStylesAnswersFilter, ParsedHobbiesAnswersFilter, ParsedSportsAnswersFilter, ParsedLocationAnswersFilter, ParsedBodyShapeAnswersFilter } from '@infrastructure/presentation/influencer/influencer.dto';

export class InfluencerUsecase {
  constructor(
    private influencerRepository: InfluencerRepository,
    private consumerRepository: ConsumerRepository,
    private followRepository: FollowRepository,
    private readonly postRepository: PostRepository,
    private readonly proposalRepository: ProposalRepository,
    private readonly affiliateProducts: AffiliateProductRepository,
  ) {}

  async getInfluncer(influencer_id, consumer_id) {
    const influencer =
      await this.influencerRepository.influncerProfile(influencer_id);
    const consumer = await this.consumerRepository.consumerProfile(consumer_id);
    const influencerDeepCopy = JSON.parse(JSON.stringify(influencer));

    const matchResults = await this.calculateMatch(influencer, consumer);

    let isFollower = false;
    const follower = await this.followRepository.isFollower(
      influencer?.user.id,
      consumer?.user.id,
    );
    if (influencer) {
      isFollower = follower ? true : false;
    }

    return this.mapInfluncerDetailResult(
      influencerDeepCopy,
      matchResults,
      isFollower,
    );
  }

  async calculateMatch(influencer, consumer) {
    const influencer_height = influencer?.measurement?.input?.photoScan.height;
    const influencer_weight = influencer?.measurement?.input?.photoScan.weight;

    const consumer_height = consumer?.measurement?.input?.photoScan?.height;
    const consumer_weight = consumer?.measurement?.input?.photoScan?.weight;

    const heightMatch =
      100 -
      (Math.abs(influencer_height - consumer_height) / consumer_height) * 100;
    const weightMatch =
      100 -
      (Math.abs(influencer_weight - consumer_weight) / consumer_weight) * 100;

    let shapeMatch = await this.calculateIndividualShapeMatch(
      consumer,
      influencer,
    );
    shapeMatch = shapeMatch && shapeMatch > 0 ? shapeMatch * 100 : 0;

    const styleMatch = this.checkSimilarity(
      influencer,
      consumer,
      STYLE_QUESTIONS_SR_NO,
    );
    const budgetMatch = this.checkSimilarity(
      influencer,
      consumer,
      BUDGET_QUESTIONS_SR_NO,
    );

    const influencerRegion = influencer?.user?.user_answer
      ?.map((user_answer) => {
        if (user_answer?.question?.title == 'Location/Geographic Region') {
          return user_answer.selected_options;
        }
        return null; // Return null for non-matching cases
      })
      .filter((style) => style !== null)
      .flat();

    const consumerRegion = consumer?.user?.user_answer
      ?.map((user_answer) => {
        if (user_answer?.question?.title == 'Location/Geographic Region') {
          return user_answer.selected_options;
        }
        return null; // Return null for non-matching cases
      })
      .filter((style) => style !== null)
      .flat();

    const regionMatch = this.calculateSimilarityScoreOfRegion(
      influencerRegion,
      consumerRegion,
    );

    const matchResults = {
      heightMatch: parseFloat(heightMatch.toFixed(2)),
      weightMatch: parseFloat(weightMatch.toFixed(2)),
      shapeMatch: parseFloat(shapeMatch),
      regionMatch: parseFloat(regionMatch.toFixed(2)),
      styleMatch: parseFloat(styleMatch.toFixed(2)),
      budgetMatch: parseFloat(budgetMatch.toFixed(2)),
    };
    return matchResults;
  }

  calculateSimilarityScoreOfRegion(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    const similarityScore = (intersection.size / union.size) * 100;

    return similarityScore ? similarityScore : 0;
  }

  checkSimilarity(influencer, consumer, question_sr_nos: number[]) {
    const influencerStyles = influencer?.user?.user_answer
      ?.map((user_answer) => {
        if (question_sr_nos.includes(user_answer?.question?.sr_no)) {
          return {
            question_id: user_answer.question.id,
            answer: user_answer.selected_options,
          };
        }
        return null; // Return null for non-matching cases
      })
      .filter((style) => style !== null); // Filter out null values

    const consumerStyles = consumer.user.user_answer
      .map((user_answer) => {
        if (question_sr_nos.includes(user_answer?.question?.sr_no)) {
          return {
            question_id: user_answer.question.id,
            answer: user_answer.selected_options,
          };
        }
        return null;
      })
      .filter((style) => style !== null);

    let totalQuestions = influencerStyles.length;
    let totalMatchingAnswers = 0;

    influencerStyles.forEach((influencerStyle) => {
      const consumerStyle = consumerStyles.find(
        (cs) => cs.question_id === influencerStyle.question_id,
      );

      if (consumerStyle) {
        const totalAnswers = influencerStyle.answer.length;
        const matchingAnswers = influencerStyle.answer.filter(
          (answer, index) => answer === consumerStyle.answer[index],
        ).length;
        totalMatchingAnswers += matchingAnswers / totalAnswers;
      }
    });

    const averageSimilarityScore =
      (totalMatchingAnswers / totalQuestions) * 100;

    return averageSimilarityScore;
  }

  async calculateIndividualShapeMatch(consumer, influencer) {
    try {
      const url = `${process.env.PYTHON_SERVER_URL}/recommendation/consumer-influencer`;
      const headers = { 'Content-Type': 'application/json' };

      let consumer_data = consumer.measurement;
      const final_consumer_data = {
        id: consumer_data?.id ? consumer_data.id : 1,
        scan_id: consumer_data?.scan_id
          ? consumer_data.scan_id
          : 'default_string',
        body_composition: consumer_data?.bodyComposition,
        customScanId: null,
        input: consumer_data?.input,
        measurements: consumer_data?.measurements,
        member_id: consumer_data?.memberId
          ? consumer_data.memberId
          : 'key_1234',
        posture: consumer_data?.posture,
        created_at: consumer_data?.createdAt
          ? consumer_data.createdAt
          : '2024-01-01T00:00:00',
        updated_at: consumer_data?.updatedAt
          ? consumer_data.updatedAt
          : '2024-01-02T00:00:00',
      };

      let influencer_data = influencer?.measurement;
      const final_influencer_data = {
        id: influencer_data?.id ? influencer_data.id : 1,
        scan_id: influencer_data?.scan_id
          ? influencer_data.scan_id
          : 'default_string',
        body_composition: influencer_data?.bodyComposition,
        custom_scan_id: null,
        input: influencer_data?.input,
        measurements: influencer_data?.measurements,
        member_id: influencer_data?.memberId
          ? influencer_data.memberId
          : 'key_1234',
        posture: influencer_data?.posture,
        created_at: influencer_data?.createdAt
          ? influencer_data.createdAt
          : '2024-01-01T00:00:00',
        updated_at: influencer_data?.updatedAt
          ? influencer_data.updatedAt
          : '2024-01-02T00:00:00',
      };

      const config = {
        headers,
        timeout: 10000, // 10 seconds timeout
      };
      if (!influencer_data || !final_influencer_data) {
        return false;
      }
      const response = await axios.post(
        url,
        {
          consumerProfile: final_consumer_data ? final_consumer_data : {},
          influenceProfile: final_influencer_data ? final_influencer_data : {},
        },
        config,
      );

      return response.data;
    } catch (error) {
      console.log('Error is ::: ', error);
      return false;
    }
  }

  mapInfluncerDetailResult(influencer, matchResults, isFollower) {
    const influencerStyles = influencer.user?.user_answer
      .map((user_answer) => {
        if (user_answer.question.title == 'Styles') {
          return user_answer.selected_options;
        }
        return null;
      })
      .filter((style) => style !== null);

    const influencerBudget = influencer.user.user_answer
      .map((user_answer) => {
        if (user_answer.question.title == 'Budgets') {
          return user_answer.selected_options;
        }
        return null;
      })
      .filter((style) => style !== null);

    const influencerRegion = influencer?.user?.user_answer
      ?.map((user_answer) => {
        if (user_answer?.question?.title == 'Location/Geographic Region') {
          return user_answer.selected_options;
        }
        return null; // Return null for non-matching cases
      })
      .filter((style) => style !== null);

    const returnData = {
      isFollower,
      influencer_id: influencer?.id,
      shape: {
        name: influencer?.shape,
        match: matchResults?.shapeMatch,
      },
      budget: {
        name: influencerBudget?.flat(),
        match: matchResults?.budgetMatch,
      },
      style: {
        name: influencerStyles?.flat(),
        match: matchResults?.styleMatch,
      },
      region: {
        name: influencerRegion?.flat(),
        match: matchResults?.regionMatch,
      },
      complexation: influencer?.complexation,
      first_name: influencer?.user.first_name,
      last_name: influencer?.user.last_name,
      avatar: influencer?.avatar,
      gender: influencer?.measurement?.input?.photoScan?.gender,
      height: {
        name: influencer?.measurement?.input?.photoScan?.height,
        match: matchResults?.heightMatch,
      },
      weight: {
        name: influencer?.measurement?.input?.photoScan?.weight,
        match: matchResults?.weightMatch,
      },
    };
    return returnData;
  }

  async updateById(id: number, payload) {
    return await this.influencerRepository.updateById(id, payload);
  }

  // async deleteInfluencerData(influencerId: number): Promise<void> {
  //   return await this.influencerRepository.deleteInfluencerData(influencerId);
  // }
  async deleteInfluencerData(influencerId: number, isSoftDelete: Boolean) {
    try {
      const postsExist =
        await this.postRepository.findPostsByInfluencerId(influencerId);

      const proposalsExist =
        await this.proposalRepository.proposalsExistForInfluencer(influencerId);

      if (postsExist) {
        const postIds = postsExist.map((post) => post.id);
        const productExist = await this.affiliateProducts.findProductsByPostId(postIds);


        if (isSoftDelete) {
          if (productExist) {
            const proudctIds = productExist.map((product) => product.id);
            await this.affiliateProducts.softDeleteByIds(proudctIds);
          }

          await this.postRepository.softDeletePostsByInfluencerId(influencerId);
        } else {
          if (productExist) {
            const proudctIds = productExist.map((product) => product.id);
            await this.affiliateProducts.deleteByIds(proudctIds);
          }
          await this.postRepository.deletePostsByInfluencerId(influencerId);
        }
      }

      if (proposalsExist) {
        if (isSoftDelete) {
          await this.proposalRepository.softDeletePostsByInfluencerId(
            influencerId,
          );
        } else {
          await this.proposalRepository.deleteProposalsByInfluencerId(
            influencerId,
          );
        }
      }

      if (isSoftDelete) {
        return this.influencerRepository.softDeleteInfluencerById(influencerId);
      } else {
        return this.influencerRepository.deleteInfluencerById(influencerId);
      }
    } catch (error) {
      throw new Error(
        `Failed to delete data for influencer ID ${influencerId}: ${error.message}`,
      );
    }
  }

  async revertInfluencerData(influencerId: number): Promise<void> {
    try {
      // Check if posts exist in soft-deleted state
      const softDeletedPosts =
        await this.postRepository.findDeletedPostsByInfluencerId(influencerId);

      // Check if proposals exist in soft-deleted state
      const softDeletedProposals =
        await this.proposalRepository.proposalsSoftDeletedExistForInfluencer(
          influencerId,
        );

      // Restore posts if they exist
      if (softDeletedPosts && softDeletedPosts.length > 0) {
        const postIds = softDeletedPosts.map((post) => post.id);
        const productExist =
          await this.affiliateProducts.findDeletedProductsByPostIds(postIds);

        if (productExist) {
          const proudctIds = productExist.map((product) => product.id);
          await this.affiliateProducts.revertSoftDeleteByIds(proudctIds);
        }
        await this.postRepository.restorSoftDeletePostsByInfluencerId(
          influencerId,
        );
      }

      // Restore proposals if they exist
      if (softDeletedProposals && softDeletedProposals.length > 0) {
        await this.proposalRepository.restorSoftDeletePostsByInfluencerId(
          influencerId,
        );
      }
      await this.influencerRepository.restoreSoftDeleteInfluencerById(
        influencerId,
      );
    } catch (error) {
      throw new Error(
        `Failed to revert data for influencer ID ${influencerId}: ${error.message}`,
      );
    }
  }

  async getInfluencersBasicInfo(influencerIds: number[], consumerId: number) {
    try {
      const influencers = await this.influencerRepository.findInfluencersByIds(influencerIds);
      
      return influencers.map(influencer => ({
        influencer_id: influencer.id,
        first_name: influencer.user?.first_name,
        last_name: influencer.user?.last_name,
        avatar: influencer.avatar,
        gender: influencer.measurement?.input?.photoScan?.gender,
      }));
    } catch (error) {
      console.error('Error fetching influencers basic info:', error);
      return [];
    }
  }
  
  private validateAnswerFilter(filter: any, filterName: string): any | undefined {
    if (!filter) return undefined;
    
    const result: any = {};
    
    if (filter.selectedOptions && filter.selectedOptions.length > 0) {
      // Validate that all options are strings and not empty
      const validOptions = filter.selectedOptions.filter(option => 
        typeof option === 'string' && option.trim().length > 0
      );
      
      if (validOptions.length === 0) {
        return undefined;
      }
      
      result.selectedOptions = validOptions;
    }
    
    return Object.keys(result).length > 0 ? result : undefined;
  }

  async fetchFilteredInfluencers(
    measurementFilter?: MeasurementFilter, 
    budgetAnswersFilter?: BudgetAnswersFilter,
    stylesAnswersFilter?: StylesAnswersFilter,
    hobbiesAnswersFilter?: HobbiesAnswersFilter,
    sportsAnswersFilter?: SportsAnswersFilter,
    locationAnswersFilter?: LocationAnswersFilter,
    bodyShapeAnswersFilter?: BodyShapeAnswersFilter
  ) {
    let parsedMeasurementFilter: ParsedMeasurementFilter | undefined;
    let parsedBudgetAnswersFilter: ParsedBudgetAnswersFilter | undefined;
    let parsedStylesAnswersFilter: ParsedStylesAnswersFilter | undefined;
    let parsedHobbiesAnswersFilter: ParsedHobbiesAnswersFilter | undefined;
    let parsedSportsAnswersFilter: ParsedSportsAnswersFilter | undefined;
    let parsedLocationAnswersFilter: ParsedLocationAnswersFilter | undefined;
    let parsedBodyShapeAnswersFilter: ParsedBodyShapeAnswersFilter | undefined;
  
    // Parse measurement filter
    if (measurementFilter) {
      parsedMeasurementFilter = {};
  
      const parseField = (value?: string, fieldName = ''): number | undefined => {
        if (!value) return undefined;
        const parsed = parseInt(value);
        if (isNaN(parsed) || parsed <= 0) {
          throw new Error(`Invalid ${fieldName} value provided`);
        }
        return parsed;
      };
  
      parsedMeasurementFilter.minHeight = parseField(measurementFilter.minHeight, 'minHeight');
      parsedMeasurementFilter.maxHeight = parseField(measurementFilter.maxHeight, 'maxHeight');
      parsedMeasurementFilter.minWeight = parseField(measurementFilter.minWeight, 'minWeight');
      parsedMeasurementFilter.maxWeight = parseField(measurementFilter.maxWeight, 'maxWeight');
  
      if (
        parsedMeasurementFilter.minHeight &&
        parsedMeasurementFilter.maxHeight &&
        parsedMeasurementFilter.minHeight > parsedMeasurementFilter.maxHeight
      ) {
        throw new Error('minHeight cannot be greater than maxHeight');
      }
  
      if (
        parsedMeasurementFilter.minWeight &&
        parsedMeasurementFilter.maxWeight &&
        parsedMeasurementFilter.minWeight > parsedMeasurementFilter.maxWeight
      ) {
        throw new Error('minWeight cannot be greater than maxWeight');
      }
    }

    // Parse all answer-based filters
    parsedBudgetAnswersFilter = this.validateAnswerFilter(budgetAnswersFilter, 'budget answers filter');
    parsedStylesAnswersFilter = this.validateAnswerFilter(stylesAnswersFilter, 'styles answers filter');
    parsedHobbiesAnswersFilter = this.validateAnswerFilter(hobbiesAnswersFilter, 'hobbies answers filter');
    parsedSportsAnswersFilter = this.validateAnswerFilter(sportsAnswersFilter, 'sports answers filter');
    parsedLocationAnswersFilter = this.validateAnswerFilter(locationAnswersFilter, 'location answers filter');
    parsedBodyShapeAnswersFilter = this.validateAnswerFilter(bodyShapeAnswersFilter, 'body shape answers filter');
  
    return this.influencerRepository.fetchFilteredInfluencers(
      parsedMeasurementFilter, 
      parsedBudgetAnswersFilter,
      parsedStylesAnswersFilter,
      parsedHobbiesAnswersFilter,
      parsedSportsAnswersFilter,
      parsedLocationAnswersFilter,
      parsedBodyShapeAnswersFilter
    );
  }
  
}
