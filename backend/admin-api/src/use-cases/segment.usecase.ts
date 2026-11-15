import { Segment } from '@infrastructure/orm/entities/segment.entity';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { SegmentRepository } from '@infrastructure/orm/reposiories/segment.repository';
import { CreateSegmentDto, UpdateSegmentDto } from '@infrastructure/presentation/segment/segment.dto';
import { HttpException, HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { CampaignStatus } from '@infrastructure/utils/constant';
import UsecaseProxy, { ADMIN_REVIEW_USECASE_PROXY, CAMPAIGN_USECASE_PROXY, INSTAGRAM_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { AdminReviewUsecase } from './admin-review.usecase';
import { InstagramUsecase } from './instagram.usecase';
import { CampaignUsecase } from './campaign.usecase';
const _ = require('lodash');

export class SegmentUsecase {
  constructor(
    private segmentRepository: SegmentRepository,
    private brandRepository: BrandRepository,
    private influencerRepository: InfluencerRepository,
    private questionRepository: QuestionnaireRepository,
    @Inject(ADMIN_REVIEW_USECASE_PROXY)
    private adminReviewUsecase: UsecaseProxy<AdminReviewUsecase>,
    @Inject(INSTAGRAM_USECASE_PROXY)
    private instagramUseCase: UsecaseProxy<InstagramUsecase>,
    @Inject(CAMPAIGN_USECASE_PROXY)
    private campaignUseCase: UsecaseProxy<CampaignUsecase>,
  ) {}

  async findAll(userId: number, page: number, limit: number, search?: string) {
    const brand = await this.brandRepository.findByUserId(userId);
    if (!brand) throw new NotFoundException('Brand not found');
    // return this.segmentRepository.findByBrandId(brand.id);
    return this.segmentRepository.findByBrands(brand.id, page, limit, search);
  }

  async create(createSegmentDto: CreateSegmentDto, userId: number): Promise<Segment> {
    const { name, savedFilter } = createSegmentDto;
    const brand = await this.brandRepository.findByUserId(userId);
    if (!brand) throw new NotFoundException('Brand not found');
    const brandId = brand.id;
    const segment = await this.segmentRepository.create({
      name,
      brandId,
      savedFilter,
    });

    return segment;
  }
  async update(id: number, updateSegmentDto: UpdateSegmentDto): Promise<Segment> {
    const segment = await this.segmentRepository.findOne(id);

    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
    const isUpdated = await this.segmentRepository.update(segment.id, updateSegmentDto);
    if (isUpdated.affected != 1) {
      throw new Error('Could not update Segment');
    }
    const updatedSegment = await this.segmentRepository.findOne(id);
    if (!updatedSegment) {
      throw new Error('Could not update Segment');
    }
    return updatedSegment;
  }

  async remove(id: number): Promise<void | any> {
    const activeCampaignCount = await this.campaignUseCase.getInstance().getCampaignsCountBySegment(id);
    if (activeCampaignCount > 0) {
      throw new HttpException('One or more associated campaigns are active.', HttpStatus.BAD_REQUEST);
    }
    await this.campaignUseCase.getInstance().deleteCampaignBySegment(id);
    return this.segmentRepository.delete(id);
  }

  async getInfluencers(id: number, page: number, limit: number, search?: string) {
    const segment = await this.segmentRepository.findOne(id);
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
    const savedFilters = await this.removeAllKeys(segment.savedFilter);
    const segmentQuestionIds = Object.keys(savedFilters).map(Number);

    const segmentQuestions = await this.questionRepository.getAllQuestionsByIds(segmentQuestionIds);
    const srNos = segmentQuestions.map((question) => question.sr_no);
    const influencerQuestions = await this.questionRepository.getInfluencerQuestionsBySrNos(srNos);

    const questionIdMap = await this.questionIdMap(segmentQuestions, influencerQuestions);

    const paginatedInfluencers = await this.influencerRepository.findPaginatedInfluencersByFilters(
      savedFilters,
      questionIdMap,
      segmentQuestionIds,
      page,
      limit,
      search,
    );

    const influencerIds = paginatedInfluencers.influencers.map((influencer) => influencer.id);
    const instagramStats = await this.instagramUseCase.getInstance().getManyUserInsights(influencerIds);

    const updatedInfluencersWithReviews = await Promise.all(
      paginatedInfluencers.influencers.map(async (influencer) => {
        const instagramStatsData = instagramStats.find((insta) => insta.influencer_id === influencer.id);
        return { ...influencer, instagramStats: instagramStatsData };
      }),
    );

    return {
      influencers: updatedInfluencersWithReviews,
      total: paginatedInfluencers.total,
    };
  }

  async getAIInfluencers(id: number, page: number, limit: number) {
    const segment = await this.segmentRepository.findOne(id);
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }

    // const questions_ids = Object.keys(segment.savedFilter).map(Number);
    // const questions_array = await this.questionRepository.getAllQuestionsByIds(questions_ids)

    const segmentQuestions = await this.questionRepository.getAllSegmentQuestions();
    const savedFilterHash = await this.removeAllKeys(segment.savedFilter);
    const questions_array = segmentQuestions.map((record) => ({
      question_id: record.id,
      sr_no: record.sr_no,
      question_category_sr_no: record.question_category_sr_no,
    }));
    let new_array = [] as any;

    const groupedByCategory = {};

    questions_array.forEach((question) => {
      const { question_category_sr_no, question_id, sr_no } = question;

      if (!groupedByCategory[question_category_sr_no]) {
        groupedByCategory[question_category_sr_no] = [];
      }
      const selectedOption = savedFilterHash[question_id] || [];

      groupedByCategory[question_category_sr_no].push({
        sr_no,
        question_id,
        selected_option: selectedOption,
      });
    });

    const finalOutput = {}; // Initialize an empty object to store the results

    Object.keys(groupedByCategory).forEach((category) => {
      const filteredQuestions = groupedByCategory[category].filter((q) => q.selected_option.length > 0);

      finalOutput[category] = filteredQuestions.length > 0 ? filteredQuestions : [];
    });

    const url = `${process.env.PYTHON_SERVER_URL}/recommendation/questionnaire-segment/?page=${1}&page_size=${200}`;
    // const url = `https://2ea4-119-63-128-58.ngrok-free.app/recommendation/questionnaire-segment/?page=${1}&page_size=${200}`;
    const headers = { 'Content-Type': 'application/json' };
    const config = { headers, timeout: 10000 };

    let obj = { segment: finalOutput };

    try {
      const response = await axios.post(url, obj, config);

      let data = response.data;

      const influencerIds = Object.keys(data).map(Number);
      const startIndex = (page - 1) * limit;
      const paginatedInfluencerIds = influencerIds.slice(startIndex, startIndex + limit);
      const filteredAiData = Object.fromEntries(Object.entries(data).filter(([key]) => paginatedInfluencerIds.includes(Number(key))));
      const influencers = await this.influencerRepository.findFilteredByIds(paginatedInfluencerIds);
      const influencersCount = influencerIds.length;

      const instagramStats = await this.instagramUseCase.getInstance().getManyUserInsights(influencerIds);

      const updatedInfluencersWithReviews = await Promise.all(
        influencers.map(async (influencer) => {
          const instagramStatsData = instagramStats.find((insta) => insta.influencer_id === influencer.id);
          return { ...influencer, instagramStats: instagramStatsData };
        }),
      );

      return {
        influencers: updatedInfluencersWithReviews,
        AiData: filteredAiData,
        total: influencersCount,
      };
    } catch (error) {
      console.error('Error in Axios post:', error);
      throw error;
    }
  }

  async getSegmentData(id: number) {
    let values = {
      Search_Result: '0 Influencers',
      Mark_As_Candidate: 0,
      Documents_Sent_to_Influencers: 0,
      Accepted_Documents: 0,
      Pending_Documents: 0,
    };

    const segment = await this.segmentRepository.findOne(id);
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }

    // const questions = await this.questionRepository.getByTitle(['Gender', 'Location/Geographic Region', 'Age', 'Languages', 'Height', 'Weight', 'Ethnicity'])
    const savedFilters = await this.removeAllKeys(segment.savedFilter);

    const segmentQuestionIds = Object.keys(savedFilters).map(Number);

    const segmentQuestions = await this.questionRepository.getAllQuestionsByIds(segmentQuestionIds);
    const srNos = segmentQuestions.map((question) => question.sr_no);
    const influencerQuestions = await this.questionRepository.getInfluencerQuestionsBySrNos(srNos);

    const questionIdMap = await this.questionIdMap(segmentQuestions, influencerQuestions);

    const searchResults = (await this.influencerRepository.findInfluencersByFilters(savedFilters, questionIdMap, segmentQuestionIds)).length;
    if (searchResults) {
      values.Search_Result = `${searchResults} Influencers`;
    }
    if (segment.markedCandidates) {
      values.Mark_As_Candidate = segment.markedCandidates.length;
    }
    return values;
  }

  async getSummary(userId: number, segmentId: number | null, specificStatusRequired?: string) {
    type Influencer = {
      id: number;
      name: string;
      profilePicture: string;
      segmentName: string | undefined;
    };

    type ValuesHash = {
      Planned: { count: number; influencers: Influencer[] };
      Completed: { count: number; influencers: Influencer[] };
      Current: { count: number; influencers: Influencer[] };
      Considering: { count: number; influencers: Influencer[] };
    };

    const values: ValuesHash = {
      Planned: { count: 0, influencers: [] },
      Completed: { count: 0, influencers: [] },
      Current: { count: 0, influencers: [] },
      Considering: { count: 0, influencers: [] },
    };
    const brand = await this.brandRepository.findByUserId(userId);
    if (!brand) {
      throw new NotFoundException('Brand not found.');
    }
    let segments: Segment[] = [];
    if (segmentId) {
      segments = await this.segmentRepository.findOneWithRelation(segmentId);
    } else {
      segments = await this.segmentRepository.findAllWithRelation(brand.id);
    }

    const markedInfluencersIds = segments
      .map((segment) => segment.markedCandidates)
      .filter((item) => item !== null)
      .flat(); // Flatten the array
    const markedInfluencers = await this.influencerRepository.findInfluencersByIds(markedInfluencersIds);

    segments.map((segment) => {
      const campaigns = segment.campaigns || []; // Default to an empty array if undefined
      // Calculate Planned
      if ((!specificStatusRequired || specificStatusRequired === 'Planned') && segment.markedCandidates) {
        const plannedCount = segment.markedCandidates.length;
        values.Planned.count += plannedCount;
        markedInfluencers.forEach((influencer) => {
          if (segment.markedCandidates.includes(influencer.id)) {
            values.Planned.influencers.push({
              id: influencer.id,
              profilePicture: influencer.avatar,
              name: influencer.user.first_name + ' ' + influencer.user.last_name,
              segmentName: segment.name,
            });
          }
        });
      }

      // Get influencers from the Planned campaigns

      if (!specificStatusRequired || specificStatusRequired !== 'Planned') {
        campaigns.forEach((campaign) => {
          if (campaign.influencer) {
            const influencerData = {
              id: campaign.influencer.id,
              profilePicture: campaign.influencer.avatar,
              segmentName: campaign.segments?.name,
              name: campaign.influencer.user.first_name + ' ' + campaign.influencer.user.last_name,
            };
            if (campaign.status === CampaignStatus.COMPLETED) {
              values.Completed.count++;
              values.Completed.influencers.push(influencerData);
            } else if (campaign.status === CampaignStatus.IN_PROGRESS) {
              values.Current.count++;
              values.Current.influencers.push(influencerData);
            } else if (campaign.status === CampaignStatus.PENDING) {
              values.Considering.count++;
              values.Considering.influencers.push(influencerData);
            }
          }
        });
      }
    }),
      // Remove duplicates in the influencers array
      !specificStatusRequired &&
        Object.keys(values).forEach((key) => {
          values[key].influencers = values[key].influencers.slice(0, 3);
        });

    return values;
  }

  async markCandidate(id, params) {
    const segment = await this.segmentRepository.findOne(id);
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
    let payload = {};
    let candidates = segment.markedCandidates;
    if (!candidates) {
      candidates = [];
    }
    const influencerId = Number(params.influencerId);

    if (!params.isMarked) {
      if (influencerId) {
        candidates.push(influencerId);
        candidates = Array.from(new Set(candidates));
      }
    } else {
      candidates = candidates.filter((value) => value !== influencerId);
    }
    payload['markedCandidates'] = candidates;

    const payloadNew: Partial<Segment> = payload;
    const isUpdated = await this.segmentRepository.update(segment.id, payloadNew);
    if (isUpdated.affected == 1) {
      const savedSegment = await this.segmentRepository.findOne(segment.id);
      if (savedSegment) {
        return savedSegment;
      } else {
        throw new Error('Something went wrong');
      }
    } else {
      throw new Error('Failed: Something went wrong');
    }
  }

  async getRecord(id) {
    const segment = await this.segmentRepository.findOne(id);
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
    return segment;
  }

  async questionIdMap(segmentQuestions, influencerQuestions) {
    let questionIdMap: Record<string, number> = {};
    segmentQuestions.forEach((segmentQuestion) => {
      const matchingInfluencerQuestion = influencerQuestions.find((influencerQuestion) => influencerQuestion.sr_no === segmentQuestion.sr_no);
      if (matchingInfluencerQuestion) {
        questionIdMap[segmentQuestion.id.toString()] = matchingInfluencerQuestion.id;
      }
    });

    return questionIdMap;
  }

  async removeAllKeys(obj) {
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key]) && obj[key].includes('All')) {
        delete obj[key];
      }
    });

    return obj;
  }
}
