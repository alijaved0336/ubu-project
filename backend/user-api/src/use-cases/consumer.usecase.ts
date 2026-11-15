import { Consumers } from '@infrastructure/orm/entities/consumer.entity';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { PostFavoriteRepository } from '@infrastructure/orm/reposiories/post-favorite.repository';
import { PostRepository } from '@infrastructure/orm/reposiories/post.repository';
import { ProductFavoriteRepository } from '@infrastructure/orm/reposiories/product-favorite.repository';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { CartRepository } from '@infrastructure/orm/reposiories/cart.repository';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { SearchRepository } from '@infrastructure/orm/reposiories/search.repository';
import { FollowRepository } from '@infrastructure/orm/reposiories/follow.repository';
import { ReviewRepository } from '@infrastructure/orm/reposiories/review.repository';
import * as qs from 'qs';
import UsecaseProxy, {
  BODY_SCAN_LOG_COUNT_USECASE_PROXY,
  BODY_MEASUREMENT_USE_CASE,
  QUESTIONNAIRE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { BodyScanLogCountUsecase } from './body-scan-log-count.usecase';
import { User } from '@infrastructure/orm/entities/user.entity';
import { BodyMeasurementUsecase } from './body-measurement.usecase';
import { QuestionnaireUsecase } from './questionnaire.usecase';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import {
  formatConsumerProfile,
  getSelectedOptionsBySrNo,
} from 'common/helpers';
import {
  BUDGET_QUESTIONS_SR_NO,
  STYLE_QUESTIONS_SR_NO,
} from 'common/constants';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { getUserAgeAndType } from './common.usecase';
import { CreateScanDto } from '@infrastructure/presentation/consumer/consumer.dto';
import { BodyMeasurementDTO } from 'common/body-gram';

type Filters = {
  isHeight: boolean;
  isShape: boolean;
  isStyle: boolean;
  isBudget: boolean;
};

@Injectable()
export class ConsumerUsecase {
  constructor(
    private consumerRepository: ConsumerRepository,
    private influencerRepository: InfluencerRepository,
    private userRepository: UserRepository,
    private postFavoriteRepository: PostFavoriteRepository,
    private postRepository: PostRepository,
    private productFavoriteRepository: ProductFavoriteRepository,
    private cartRepository: CartRepository,
    private questionnaireRepository: QuestionnaireRepository,
    private searchRepository: SearchRepository,
    private followRepository: FollowRepository,
    private reviewRepository: ReviewRepository,
    private profileRepository: ProfileRepository,
    @Inject(BODY_SCAN_LOG_COUNT_USECASE_PROXY)
    private readonly bodyScanLogCountUseCase: UsecaseProxy<BodyScanLogCountUsecase>,
    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
  ) {}

  async getById(id: number) {
    const optimzed_data = {};
    const consumer =
      await this.consumerRepository.findOneWithSelectedAttributes(id);
    if (consumer) {
      const isScanned = await this.bodyMeasurementUseCase
        .getInstance()
        .isUserScanned(consumer.measurement?.id || null);

      const user = await this.userRepository.findById(consumer.user.id);

      if (!user) {
        throw new UnauthorizedException('Invalid token User not found');
      }
      optimzed_data['id'] = consumer?.id;
      optimzed_data['email'] = user?.email;
      optimzed_data['first_name'] = user?.first_name;
      optimzed_data['last_name'] = user?.last_name;
      optimzed_data['avatar'] = consumer.avatar;
      optimzed_data['phone_number'] = user?.phone_number;
      optimzed_data['address'] = user?.address;
      optimzed_data['email_verified'] = user?.email_verified;
      optimzed_data['userId'] = user?.id;

      const { getUser, userType, age } = await getUserAgeAndType(
        this.userRepository,
        user.id,
      );

      if (!getUser) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
      }
      const isSurveyDone = await this.questionnaireUseCase
        .getInstance()
        .isSurveyDoneForCurrentUserType(user.id, userType);
      optimzed_data['is_under_five'] = age < 5 ? true : false;
      optimzed_data['isScanned'] = isScanned;
      optimzed_data['isSurveyDone'] = isSurveyDone;
      optimzed_data['dob'] = user?.dob;

      optimzed_data['new_complexion'] =
        getSelectedOptionsBySrNo(
          consumer?.user?.user_answer || [],
          9,
          userType,
        ) ?? [];
      optimzed_data['new_shape'] =
        getSelectedOptionsBySrNo(
          consumer?.user?.user_answer || [],
          10,
          userType,
        ) ?? [];
      const mStyles = getSelectedOptionsBySrNo(
        consumer?.user?.user_answer || [],
        16,
        userType,
      );
      const fStyles = getSelectedOptionsBySrNo(
        consumer?.user?.user_answer || [],
        17,
        userType,
      );
      const nStyles = getSelectedOptionsBySrNo(
        consumer?.user?.user_answer || [],
        31,
        userType,
      );

      const allStyles = [...mStyles, ...fStyles, ...nStyles];
      optimzed_data['new_style'] = allStyles.length > 0 ? allStyles : [];

      optimzed_data['new_gender'] =
        getSelectedOptionsBySrNo(
          consumer?.user?.user_answer || [],
          2,
          userType,
        ).join(',') ?? '';

      optimzed_data['new_height'] =
        consumer?.measurement?.input?.photoScan?.height ??
        (null as unknown as string);
      optimzed_data['new_weight'] =
        consumer?.measurement?.input?.photoScan?.weight ??
        (null as unknown as string);
      optimzed_data['new_age'] =
        consumer?.measurement?.input?.photoScan?.age ??
        (null as unknown as string);
      optimzed_data['new_age'] =
        consumer?.measurement?.input?.photoScan?.age ??
        (null as unknown as string);
      const { new_waistGirth, new_waistHeight } = this.extractNewMeasurements(
        consumer?.measurement?.measurements,
      );

      const isChildUser = await this.profileRepository.isChildUser(user.id);

      optimzed_data['is_primary_user'] = !isChildUser;

      if (isChildUser) {
        const childProfile = await this.profileRepository.findByChildUserId(
          user.id,
        );
        optimzed_data['sub_profile_relation'] = childProfile?.relation;
        optimzed_data['is_dependent'] = childProfile?.isDependant;
      }
    }

    return optimzed_data;

    //     const data = await this.consumerRepository.findOneWithSelectedAttributes(id)
    //     if(data)
    //         {
    //   const isScanned = await this.bodyMeasurementUseCase
    //     .getInstance()
    //     .isUserScanned(data.measurement?.id || null);
    //   const isSurveyDone = await this.questionnaireUseCase
    //     .getInstance()
    //     .isSurveyDoneForCurrentUserType(data.user.id, UserType.CONSUMER);
    //         data["email_verified"] = data?.user.email_verified;
    //         data["isScanned"] = isScanned
    //         data["isSurveyDone"] = isSurveyDone

    //         data['complexion'] =
    //         getSelectedOptionsBySrNo(data?.user?.user_answer || [], 9, UserType.CONSUMER) ?? []
    //       data['shape'] =
    //         getSelectedOptionsBySrNo(data?.user?.user_answer || [], 10, UserType.CONSUMER) ?? []
    //         const mStyles = getSelectedOptionsBySrNo(data?.user?.user_answer || [], 16, UserType.CONSUMER);
    //         const fStyles = getSelectedOptionsBySrNo(data?.user?.user_answer || [], 17, UserType.CONSUMER);
    //         const nStyles = getSelectedOptionsBySrNo(data?.user?.user_answer || [], 31, UserType.CONSUMER);

    //         const allStyles = [...mStyles, ...fStyles, ...nStyles];
    //         data['style'] = allStyles.length > 0 ? allStyles : [];

    //       data['gender'] =
    //         getSelectedOptionsBySrNo(data?.user?.user_answer || [], 2, UserType.CONSUMER).join(",") ?? ""

    //       data['height'] =
    //         data?.measurement?.input?.photoScan?.height ??
    //         (null as unknown as string);
    //       data['weight'] =
    //         data?.measurement?.input?.photoScan?.weight ??
    //         (null as unknown as string);
    //       data['age'] =
    //         data?.measurement?.input?.photoScan?.age ?? (null as unknown as string);
    //     }

    //     return formatConsumerProfile(data);
  }

  async getByIdOld(id: number) {
    const data =
      await this.consumerRepository.findOneWithSelectedAttributes(id);
    if (data) {
      const isScanned = await this.bodyMeasurementUseCase
        .getInstance()
        .isUserScanned(data.measurement?.id || null);

      const user = await this.userRepository.findById(data.user.id);

      if (!user) {
        throw new UnauthorizedException('Invalid token User not found');
      }

      const { getUser, userType } = await getUserAgeAndType(
        this.userRepository,
        user.id,
      );

      if (!getUser) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
      }
      const isSurveyDone = await this.questionnaireUseCase
        .getInstance()
        .isSurveyDoneForCurrentUserType(getUser.id, userType);

      data['email_verified'] = data?.user.email_verified;
      data['isScanned'] = isScanned;
      data['isSurveyDone'] = isSurveyDone;
      data['new_complexion'] =
        getSelectedOptionsBySrNo(data?.user?.user_answer || [], 9, userType) ??
        [];
      data['new_shape'] =
        getSelectedOptionsBySrNo(data?.user?.user_answer || [], 10, userType) ??
        [];
      const mStyles = getSelectedOptionsBySrNo(
        data?.user?.user_answer || [],
        16,
        userType,
      );
      const fStyles = getSelectedOptionsBySrNo(
        data?.user?.user_answer || [],
        17,
        userType,
      );
      const nStyles = getSelectedOptionsBySrNo(
        data?.user?.user_answer || [],
        31,
        userType,
      );

      const allStyles = [...mStyles, ...fStyles, ...nStyles];
      data['new_style'] = allStyles.length > 0 ? allStyles : [];
      data['new_gender'] =
        getSelectedOptionsBySrNo(
          data?.user?.user_answer || [],
          2,
          userType,
        ).join(',') ?? '';

      data['new_height'] =
        data?.measurement?.input?.photoScan?.height ??
        (null as unknown as string);
      data['new_weight'] =
        data?.measurement?.input?.photoScan?.weight ??
        (null as unknown as string);
      data['new_age'] =
        data?.measurement?.input?.photoScan?.age ?? (null as unknown as string);
      data['new_age'] =
        data?.measurement?.input?.photoScan?.age ?? (null as unknown as string);
      const { new_waistGirth, new_waistHeight } = this.extractNewMeasurements(
        data?.measurement?.measurements,
      );
      data['new_waistGirth'] = new_waistGirth;
      data['new_waistHeight'] = new_waistHeight;

      const isChildUser = await this.profileRepository.isChildUser(
        data?.userId,
      );

      data['is_primary_user'] = !isChildUser;
      if (isChildUser) {
        const childProfile = await this.profileRepository.findByChildUserId(
          data?.userId,
        );
        data['sub_profile_relation'] = childProfile?.relation;
        data['is_dependent'] = childProfile?.isDependant;
      }
    }
    return data;
  }
  extractNewMeasurements(measurements) {
    const getValue = (key) =>
      measurements?.find((m) => m.name === key)?.value ?? null;

    const new_waistGirth = getValue('waistGirth');
    const new_waistHeight = getValue('waistHeight');

    return { new_waistGirth, new_waistHeight };
  }

  async updateById(consumer_id, payload) {
    const result = await this.consumerRepository.updateById(
      consumer_id,
      payload,
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Consumer with ID ${consumer_id} not found`);
    }

    return 'Consumer Successfully Updated!';
  }

  async saveMeasurments(scan_id: string, userDetails) {
    try {
      await this.bodyScanLogCountUseCase.getInstance().updateBodyScanLogCount();
      const org_id = process.env.BODYGRAM_ORGANIZATION_ID;
      const Authorization = process.env.BODYGRAM_API_KEY;
      const url = `https://platform.bodygram.com/api/orgs/${org_id}/scans/${scan_id}`;
      const headers = {
        accept: 'application/json',
        Authorization,
      };
      const response = await axios.get(url, { headers });
      const fetched_data = response.data.entry;

      const measurements_data = {
        scan_id: fetched_data.id,
        bodyComposition: fetched_data.bodyComposition,
        customScanId: fetched_data.customScanId,
        input: fetched_data.input,
        measurements: fetched_data.measurements,
        memberId: fetched_data.memberId,
        posture: fetched_data.posture,
      };
      await this.upsertConsumerMeasurements(userDetails.id, measurements_data);
    } catch (error) {
      console.log('Error is ::: ', error);
      return 'Consumer Measurements failed to add';
    }
  }

  async influencerRecommendation(
    user: User,
    filters: Filters,
    pageNumber: number,
    limitNumber: number,
  ) {
    try {
      const consumerData = await this.getConsumerData(user.consumer.id);

      if (!consumerData) {
        throw new Error('Consumer data not found');
      }

      const operations = await this.getOperations(
        filters,
        consumerData,
        pageNumber,
        limitNumber,
        user.id,
      );

      const results = await Promise.all(operations);

      return this.formatResponse(filters, results);
    } catch (error) {
      console.error('Error in influencerRecommendation:', error);
      throw error;
    }
  }

  private async getConsumerData(id: number): Promise<Consumers | null> {
    return await this.consumerRepository.findOneWithSelectedAttributes(id);
  }

  private getOperations(
    filters: Filters,
    consumerData,
    pageNumber: number,
    limitNumber: number,
    userId: number,
  ): Promise<any>[] {
    const operations: Promise<any>[] = [];

    if (filters.isHeight) {
      operations.push(
        this.similarHeightInfluencerRecommendation(
          consumerData,
          pageNumber,
          limitNumber,
          userId,
        ),
      );
    }
    if (filters.isBudget) {
      operations.push(
        this.similarBudgetInfluencerRecommendation(
          consumerData,
          pageNumber,
          limitNumber,
        ),
      );
    }
    if (filters.isShape) {
      operations.push(
        this.similarShapeInfluencerRecommendation(
          consumerData,
          pageNumber,
          limitNumber,
          userId,
        ),
      );
    }
    if (filters.isStyle) {
      operations.push(
        this.similarStyleInfluencerRecommendation(
          consumerData,
          pageNumber,
          limitNumber,
        ),
      );
    }

    return operations;
  }

  private formatResponse(filters: Filters, results: any[]): any {
    const response: any = {};
    let resultIndex = 0;

    if (filters.isHeight) {
      response.height = results[resultIndex++];
    }
    if (filters.isBudget) {
      response.budget = results[resultIndex++];
    }
    if (filters.isShape) {
      response.shape = results[resultIndex++];
    }
    if (filters.isStyle) {
      response.style = results[resultIndex++];
    }

    return response;
  }

  private async similarHeightInfluencerRecommendation(
    consumerData,
    pageNumber: number,
    limitNumber: number,
    userId: number,
  ) {
    try {
      const url = `${process.env.PYTHON_SERVER_URL}/influencer-recommendation/body/?page=${pageNumber}&page_size=${limitNumber}&isShape=false&isHeight=true`;
      const headers = { 'Content-Type': 'application/json' };
      let final_data = consumerData?.measurement;
      if (!final_data) {
        return [];
      }
      const data2 = {
        id: userId,
        scan_id: final_data.scan_id ? final_data.scan_id : 'default_string',
        body_composition: final_data.bodyComposition,
        custom_scan_id: null,
        input: final_data.input,
        measurements: final_data.measurements,
        member_id: final_data.memberId ? final_data.memberId : 'key_1234',
        posture: final_data.posture,
        created_at: final_data.createdAt
          ? final_data.createdAt
          : '2024-01-01T00:00:00',
        updated_at: final_data.updatedAt
          ? final_data.updatedAt
          : '2024-01-02T00:00:00',
      };

      const config = {
        headers,
        timeout: 10000, // 10 seconds timeout
      };

      const response = await axios.post(url, data2, config);
      const response_data = response.data;

      let influencer_ids = Object.keys(response_data.height).map((key) =>
        Number(key),
      );
      const influencers =
        await this.influencerRepository.getRecommendedInfluncerProfileIds(
          influencer_ids,
        );
      let result = influencers.map((influencer) => {
        return {
          ...influencer,
          similarity_score:
            parseFloat(response_data.height[influencer.influencer_id]) * 100,
        };
      });
      return result;
    } catch (error) {
      console.log('Error is ::: ', error);
      return [];
    }
  }

  private async similarBudgetInfluencerRecommendation(
    consumerData,
    pageNumber: number,
    limitNumber: number,
  ) {
    // Implement similar logic as similarHeightInfluencerRecommendation for budget
    try {
      const url = `${process.env.PYTHON_SERVER_URL}/recommendation/from-questionnaire/?page=${pageNumber}&page_size=${limitNumber}`;
      const headers = { 'Content-Type': 'application/json' };
      const mappedData = consumerData?.user?.user_answer
        ?.map((user_answer) => {
          if (BUDGET_QUESTIONS_SR_NO.includes(user_answer?.question?.sr_no)) {
            return {
              sr_no: user_answer.question.sr_no,
              question_id: user_answer.question.id,
              answer: user_answer.selected_options,
            };
          }
          return null;
        })
        .filter((style) => style !== null);
      if (!mappedData) {
        return [];
      }
      const data = {
        payload: mappedData,
      };

      const config = {
        headers,
        timeout: 10000, // 10 seconds timeout
      };
      const response = await axios.post(url, data, config);
      const response_data = response.data;

      let user_ids = Object.keys(response_data).map((key) => Number(key));

      const influencers =
        await this.influencerRepository.getRecommendedInfluncerProfileById(
          user_ids,
        );
      let result = influencers.map((influencer) => {
        return {
          ...influencer,
          similarity_score: parseFloat(response_data[influencer.user_id]),
        };
      });
      return result;
    } catch (error) {
      console.log('Error is ::: ', error);
      return [];
    }
  }

  private async similarShapeInfluencerRecommendation(
    consumerData,
    pageNumber: number,
    limitNumber: number,
    userId: number,
  ) {
    const url = `${process.env.PYTHON_SERVER_URL}/influencer-recommendation/body/?page=${pageNumber}&page_size=${limitNumber}&isShape=true&isHeight=false`;
    const headers = { 'Content-Type': 'application/json' };
    let final_data = consumerData?.measurement;
    if (!final_data) {
      return [];
    }
    const data = {
      id: userId,
      scan_id: final_data.scan_id ? final_data.scan_id : 'default_string',
      body_composition: final_data.bodyComposition,
      custom_scan_id: null,
      input: final_data.input,
      measurements: final_data.measurements,
      member_id: final_data.memberId ? final_data.memberId : 'key_1234',
      posture: final_data.posture,
      created_at: final_data.createdAt
        ? final_data.createdAt
        : '2024-01-01T00:00:00',
      updated_at: final_data.updatedAt
        ? final_data.updatedAt
        : '2024-01-02T00:00:00',
    };

    const config = {
      headers,
      timeout: 10000, // 10 seconds timeout
    };
    try {
      const response = await axios.post(url, data, config);
      const response_data = response.data;

      let influencer_ids = Object.keys(response_data.shape).map((key) =>
        Number(key),
      );
      const influencers =
        await this.influencerRepository.getRecommendedInfluncerProfileIds(
          influencer_ids,
        );
      let result = influencers.map((influencer) => {
        return {
          ...influencer,
          similarity_score:
            parseFloat(response_data.shape[influencer.influencer_id]) * 100,
        };
      });
      return result;
    } catch (error) {
      console.log('Error is ::: ', error);
      return null;
    }
  }

  private async similarStyleInfluencerRecommendation(
    consumerData,
    pageNumber: number,
    limitNumber: number,
  ) {
    try {
      const url = `${process.env.PYTHON_SERVER_URL}/recommendation/from-questionnaire/?page=${pageNumber}&page_size=${limitNumber}`;
      const headers = { 'Content-Type': 'application/json' };
      const mappedData = consumerData?.user?.user_answer
        ?.map((user_answer) => {
          if (STYLE_QUESTIONS_SR_NO.includes(user_answer?.question?.sr_no)) {
            return {
              sr_no: user_answer.question.sr_no,
              question_id: user_answer.question.id,
              answer: user_answer.selected_options,
            };
          }
          return null;
        })
        .filter((style) => style !== null);

      if (!mappedData) {
        return [];
      }
      const data = {
        payload: mappedData,
      };

      const config = {
        headers,
        timeout: 10000, // 10 seconds timeout
      };
      const response = await axios.post(url, data, config);
      const response_data = response.data;

      if (Object.keys(response_data).length) {
        let user_ids = Object.keys(response_data).map((key) => Number(key));

        const influencers =
          await this.influencerRepository.getRecommendedInfluncerProfileById(
            user_ids,
          );
        let result = influencers.map((influencer) => {
          return {
            ...influencer,
            similarity_score: parseFloat(response_data[influencer.user_id]),
          };
        });
        return result;
      } else {
        console.log('Data not found from AI Server');
        return [];
      }
    } catch (error) {
      console.log('Error is ', error);
      return [];
    }
  }

  async removeMyAccount(userId: number) {
    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!consumer) throw new NotFoundException('Consumer not found.');
    const consumer_id = consumer.id;
    const deletePromises = [
      this.productFavoriteRepository.removeFavouriteProducts(consumer_id),
      this.cartRepository.removeFromCartByUser(consumer_id),
      this.questionnaireRepository.removeUsersAnswers(userId),
      this.searchRepository.removeUsersSearches(userId),
      this.followRepository.removeFollowers(userId),
      this.reviewRepository.removeConsumerReviews(consumer_id),
      this.postRepository.removeConsumerVisitedPost(consumer_id),
      this.postFavoriteRepository.removeConsumerFavouritePost(consumer_id),
    ];
    await Promise.all(deletePromises);
    const body_measurment =
      await this.consumerRepository.body_measurment(consumer_id);
    await this.consumerRepository.removeConsumer(consumer_id);
    await this.consumerRepository.removeMeasurments(body_measurment);
    await this.userRepository.removeUser(userId);

    return {
      statusCode: 200,
      message: 'Account has been removed successfully.',
    };
  }

  async markPostFavourite(postId: number, userId: number) {
    const post = await this.postRepository.findById(postId);
    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!post || !consumer)
      throw new NotFoundException('Either post or user not found.');
    const isPostFavorite =
      await this.postFavoriteRepository.findByConsumerIdAndPostId(
        consumer.id,
        post.id,
      );
    if (isPostFavorite)
      throw new ConflictException('Post Already marked as favorite');
    return this.postFavoriteRepository.markPostFavorite(consumer.id, postId);
  }
  async listPostFavorite(userId: number) {
    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!consumer) throw new NotFoundException('User not found.');
    return this.postFavoriteRepository.findAllByConsumerId(consumer.id);
  }

  async markPostUnFavorite(postId: number, userId: number) {
    const post = await this.postRepository.findById(postId);
    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!post || !consumer)
      throw new NotFoundException('Either post or user not found.');
    return this.postFavoriteRepository.delete(consumer.id, postId);
  }

  async deleteConsumerData(consumerId: number, isSoftDelete: Boolean) {
    const bm = await this.consumerRepository.findBMByConsumerId(consumerId);
    if (isSoftDelete) {
      await this.consumerRepository.softDeleteConsumerData(consumerId);
      await this.consumerRepository.softDeleteConsumerById(consumerId);
      if (bm) {
        return this.consumerRepository.softDeleteBodyMeasurmentByBmId(bm?.id);
      }
      return;
    }
    await this.consumerRepository.deleteConsumerData(consumerId);
    await this.consumerRepository.hardDeleteConsumerById(consumerId);
    if (bm) {
      return this.consumerRepository.hardDeleteBodyMeasurmentByBmId(bm.id);
    }
    return;
  }
  async revertConsumerData(consumerId: number): Promise<void> {
    const bm = await this.consumerRepository.findBMByConsumerId(consumerId);
    if (bm) {
      await this.consumerRepository.restoreSoftDeleteBodyMeasurmentByBmId(
        bm.id,
      );
    }
    await this.consumerRepository.restoreConsumerById(consumerId);
    return this.consumerRepository.restoreSoftDeleteConsumerData(consumerId);
  }

  async ManualConsumerMeasurement(createScanDto: CreateScanDto, user: User) {
    if (!user.dob) {
      throw new BadRequestException('User date of birth is required');
    }

    const payload = JSON.parse(
      JSON.stringify(BodyMeasurementDTO),
    ) as typeof BodyMeasurementDTO;

    payload.input.photoScan.gender = createScanDto.gender;
    payload.input.photoScan.height = createScanDto.height;
    payload.input.photoScan.weight = createScanDto.weight;

    const keys: Array<keyof CreateScanDto> = [
      'outseamR',
      'thighGirthR',
      'bellyWaistGirth',
      'bustGirth',
      'hipGirth',
      'outerArmLengthR',
      'acrossBackShoulderWidth',
      'waistGirth',
    ];

    payload.measurements.forEach((m) => {
      if (keys.includes(m.name as any)) {
        // @ts-expect-error we know this lines up
        m.value = createScanDto[m.name as keyof CreateScanDto];
      }
    });

    return this.upsertConsumerMeasurements(user.id, payload);
  }

  private async upsertConsumerMeasurements(
    userId: number,
    measurementData: Record<string, any>,
  ) {
    const currentUser = await this.userRepository.findById(userId);
    if (!currentUser) throw new NotFoundException('User not found');
    if (currentUser?.consumer?.measurement) {
      await this.bodyMeasurementUseCase
        .getInstance()
        .update({ id: currentUser.consumer.measurement.id }, measurementData);
    } else {
      const consumer_measurment =
        await this.consumerRepository.saveMeasurements(measurementData);
      await this.consumerRepository.updateById(currentUser.consumer.id, {
        measurement: consumer_measurment['id'],
      });
      if (currentUser.is_influencer) {
        await this.influencerRepository.updateById(currentUser.influencer.id, {
          measurement: consumer_measurment['id'],
        });
      }
    }
    return { message: 'Consumer Measurements Added' };
  }
}
