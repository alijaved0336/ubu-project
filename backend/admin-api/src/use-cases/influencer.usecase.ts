import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { JwtService } from '@infrastructure/services/jwt/jwt.service';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid package
import { Influencers } from '@infrastructure/orm/entities/influencer.entity';
import UsecaseProxy, {
  BODY_SCAN_LOG_COUNT_USECASE_PROXY,
  COMMON_USECASE_PROXY,
  QUESTIONNAIRE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { BodyScanLogCountUsecase } from './body-scan-log-count.usecase';
import axios from 'axios';
import { BadRequestException, HttpException, HttpStatus, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BODY_MEASUREMENT_USE_CASE } from 'infrastructure-usecases-bridge/usecase-proxy';
import { BodyMeasurementUsecase } from './body-measurement.usecase';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { CreateScanDto, UpdateInfluencerProfileDto, UpdateMeasurementDto } from '@infrastructure/presentation/influencer/influencer.dto';
import { User } from '@infrastructure/orm/entities/user.entity';
import { BodyMeasurement } from '@infrastructure/orm/entities/body-measurement.entity';
import { ProfileRepository } from '@infrastructure/orm/reposiories/profile.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { CommonUsecase } from './common.usecase';
import { QuestionnaireUsecase } from './questionnaire.usecase';
import { getSelectedOptionsBySrNo } from '@infrastructure/utils/helper';
import { BodyMeasurementDTO } from '@infrastructure/utils/body-gram';

export class InfluencerUsecase {
  constructor(
    private influencerRepository: InfluencerRepository,
    private consumerRepository: ConsumerRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @Inject(BODY_SCAN_LOG_COUNT_USECASE_PROXY)
    private readonly bodyScanLogCountUseCase: UsecaseProxy<BodyScanLogCountUsecase>,
    @Inject(BODY_MEASUREMENT_USE_CASE)
    private readonly bodyMeasurementUseCase: UsecaseProxy<BodyMeasurementUsecase>,
    private profileRepository: ProfileRepository,
    @Inject(COMMON_USECASE_PROXY)
    private readonly commonUsecaseProxy: UsecaseProxy<CommonUsecase>,
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
  ) {}

  async create(payload) {
    return await this.influencerRepository.create(payload);
  }

  async findOne(id) {
    const data = await this.influencerRepository.findOne(id);
    if (data) {
      const isChildUser = await this.profileRepository.isChildUser(data?.userId);

      data['is_primary_user'] = !isChildUser;
      if (isChildUser) {
        const childUser = await this.profileRepository.findByChildUserId(data?.userId);
        data['sub_profile_realtion'] = childUser?.relation;
      }
    }
    return data;
  }

  async getById(id: number) {
    const optimzed_data = {};
    // const consumer = await this.consumerRepository.(id);
    const influencer = await this.influencerRepository.findOne(id);
    if (influencer) {
      const isScanned = await this.bodyMeasurementUseCase.getInstance().isUserScanned(influencer.measurement?.id || null);
      const user = await this.userRepository.findById(influencer.user.id);

      if (!user) {
        throw new UnauthorizedException('Invalid token User not found');
      }
      optimzed_data['id'] = influencer?.id;
      optimzed_data['email'] = user?.email;
      optimzed_data['first_name'] = user?.first_name;
      optimzed_data['last_name'] = user?.last_name;
      optimzed_data['avatar'] = influencer.avatar;
      optimzed_data['phone_number'] = user?.phone_number;
      optimzed_data['address'] = user?.address;
      optimzed_data['email_verified'] = user?.email_verified;
      optimzed_data['dob'] = user?.dob;
      optimzed_data['userId'] = user?.id;

      const { getUser, userType, age: new_age } = await this.commonUsecaseProxy.getInstance().getUserAgeAndType(this.userRepository, user.id);

      if (!getUser) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
      }
      const isSurveyDone = await this.questionnaireUseCase.getInstance().isSurveyDoneForCurrentUserType(user.id, userType);

      optimzed_data['isScanned'] = isScanned;
      optimzed_data['isSurveyDone'] = isSurveyDone;
      optimzed_data['is_under_five'] = new_age < 5 ? true : false;

      optimzed_data['new_complexion'] = getSelectedOptionsBySrNo(influencer?.user?.user_answer || [], 9, userType) ?? [];
      optimzed_data['new_shape'] = getSelectedOptionsBySrNo(influencer?.user?.user_answer || [], 10, userType) ?? [];
      const mStyles = getSelectedOptionsBySrNo(influencer?.user?.user_answer || [], 16, userType);
      const fStyles = getSelectedOptionsBySrNo(influencer?.user?.user_answer || [], 17, userType);
      const nStyles = getSelectedOptionsBySrNo(influencer?.user?.user_answer || [], 31, userType);

      const allStyles = [...mStyles, ...fStyles, ...nStyles];
      optimzed_data['new_style'] = allStyles.length > 0 ? allStyles : [];

      optimzed_data['new_gender'] = getSelectedOptionsBySrNo(influencer?.user?.user_answer || [], 2, userType).join(',') ?? '';

      const { age, height, weight } = this.extractPhotoScanMeasurements(influencer?.measurement?.input?.photoScan);

      optimzed_data['new_height'] = height;
      optimzed_data['new_weight'] = weight;
      optimzed_data['new_age'] = age;

      // const { new_waistGirth, new_waistHeight } = this.extractNewMeasurements(influencer?.measurement?.measurements);

      const isChildUser = await this.profileRepository.isChildUser(user.id);

      optimzed_data['is_primary_user'] = !isChildUser;

      if (isChildUser) {
        const childProfile = await this.profileRepository.findByChildUserId(user.id);
        optimzed_data['sub_profile_relation'] = childProfile?.relation;
        optimzed_data['is_dependent'] = childProfile?.isDependant;
      }
    }

    return optimzed_data;
  }

  async influencerProfile(influncerId) {
    const influencer = await this.influencerRepository.influncerProfile(influncerId);
    if (!influencer) {
      throw new HttpException('Influencer not found', 404);
    }
    const { waistGirth, waistHeight } = this.extractWaistMeasurements(influencer?.measurement?.measurements);
    const { age, height, weight } = this.extractPhotoScanMeasurements(influencer?.measurement?.input?.photoScan);
    const { email, first_name, last_name, address, phone_number } = influencer.user;
    const gender = this.getGenderAnswer(influencer.user.user_answer);
    return {
      waistGirth,
      waistHeight,
      age,
      height,
      weight,
      email,
      first_name,
      last_name,
      address,
      gender,
      phone_number,
    };
  }

  async updateInfluencerProfile(user: User, payload: UpdateInfluencerProfileDto) {
    try {
      const influencerProfile = await this.influencerRepository.findByUserId(user.id);
      if (!influencerProfile) throw new NotFoundException('Influencer not foumd');

      influencerProfile.user.first_name = payload.user_details.first_name;
      influencerProfile.user.last_name = payload.user_details.last_name;
      influencerProfile.user.address = payload.user_details.address || '';
      influencerProfile.user.phone_number = payload.user_details.phone_number || '';

      let updateMeasurements = influencerProfile.measurement?.measurements;
      if (payload?.user_body?.measurment?.waistGirth) {
        updateMeasurements = this.updateMeasurements(influencerProfile.measurement?.measurements || [], payload?.user_body?.measurment);
      }
      if (influencerProfile.measurement) {
        const existingInputData = influencerProfile.measurement.input;
        existingInputData.photoScan.height = payload.user_body.height ?? null;
        existingInputData.photoScan.weight = payload.user_body.weight ?? null;
        existingInputData.photoScan.age = payload.user_body.age ?? null;

        influencerProfile.measurement.input = existingInputData;
        influencerProfile.measurement.measurements = updateMeasurements;
      }

      await this.influencerRepository.save(influencerProfile);

      return {
        success: true,
        message: 'Influencer updated successfully',
      };
    } catch (error) {
      throw new Error(`Failed to update influencer: ${error.message}`);
    }
  }

  updateMeasurements(measurements, bodyMeasurements) {
    return measurements?.map(({ name, unit, value }) => {
      let newValue = value;

      switch (name) {
        case 'waistGirth':
          if (bodyMeasurements.waistGirth != null) {
            newValue = bodyMeasurements.waistGirth;
          }
          break;
        default:
          break;
      }

      return {
        name,
        unit,
        value: newValue,
      };
    });
  }

  getGenderAnswer(userAnswers) {
    const entry = userAnswers.find((u) => u.question.sr_no === 2);
    if (!entry) return null;

    const [answer] = entry.selected_options;
    return answer;
  }

  extractWaistMeasurements(measurements) {
    const getValue = (key) => measurements.find((m) => m.name === key)?.value ?? null;
    const waistGirth = getValue('waistGirth');
    const waistHeight = getValue('waistHeight');
    return { waistGirth, waistHeight };
  }

  extractPhotoScanMeasurements(photoScan) {
    const age = photoScan?.age;
    const gender = photoScan?.gender;
    const height = photoScan?.height;
    const weight = photoScan?.weight;
    return { age, gender, height, weight };
  }

  async findOneByEmail(email) {
    return await this.influencerRepository.findOneByEmail(email);
  }

  async updateInfluencerModalStatus(influencerId) {
    return await this.influencerRepository.updateById(influencerId, { is_show_modal: false });
  }

  async generateBodyMeasurmentToken(userInfo) {
    if (!userInfo.influencer?.id) {
      return {
        msg: 'Influencer not created',
      };
    }
    const isAlreadyBodyMeasured = await this.influencerRepository.is_body_measurment(userInfo.influencer?.id);
    if (isAlreadyBodyMeasured) {
      return {
        msg: 'Already Scanned',
      };
    }

    const accessToken = await this.jwtService.createAccessToken({ email: userInfo.email }, '15min');
    const scanId = uuidv4();
    return {
      is_scanned: false,
      url: `https://ubu.live/body-scan?scanId=scan_${scanId}&token=${accessToken}`,
    };
  }

  async isAuthenticatedInfluncerforScan(userInfo) {
    const isAlreadyBodyMeasured = await this.influencerRepository.is_body_measurment(userInfo.influencer.id);
    if (isAlreadyBodyMeasured) {
      return {
        is_scanned: true,
        message: 'Already Scanned',
      };
    }
    return {
      is_scanned: false,
      message: 'Need to Scan',
    };
  }

  async saveMeasurments(scan_id: string, influencer) {
    await this.bodyScanLogCountUseCase.getInstance().updateBodyScanLogCount();
    const org_id = process.env.BODYGRAM_ORGANIZATION_ID;
    const Authorization = process.env.BODYGRAM_API_KEY;
    const url = `https://platform.bodygram.com/api/orgs/${org_id}/scans/${scan_id}`;
    const headers = {
      accept: 'application/json',
      Authorization,
    };
    const response = await axios.get(url, { headers });
    if (response?.data?.entry) {
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

      return this.upsertInfluencerMeasurements(influencer.user.id, measurements_data);
    }
  }

  async ManualInfluencerMeasurement(createScanDto: CreateScanDto, user: User) {
    if (!user.dob) {
      throw new BadRequestException('User date of birth is required');
    }

    const payload = JSON.parse(JSON.stringify(BodyMeasurementDTO)) as typeof BodyMeasurementDTO;

    payload.input.photoScan.gender = createScanDto.gender ?? null;
    payload.input.photoScan.height = createScanDto.height ?? null;
    payload.input.photoScan.weight = createScanDto.weight ?? null;
    payload.input.photoScan.age = createScanDto.age ?? null;
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

    return this.upsertInfluencerMeasurements(user.id, payload);
  }

  private async upsertInfluencerMeasurements(userId: number, measurementData: Record<string, any>) {
    const currentInfluencer = await this.influencerRepository.findByUserId(userId);

    if (!currentInfluencer) throw new NotFoundException('User not found');

    if (currentInfluencer?.measurement) {
      await this.bodyMeasurementUseCase.getInstance().update(currentInfluencer.measurement.id, measurementData);
    } else {
      const influencer_measurment = await this.influencerRepository.saveMeasurements(measurementData);
      await this.influencerRepository.updateById(currentInfluencer.id, {
        measurement: {
          id: influencer_measurment['id'],
        },
      });
      if (currentInfluencer?.user.is_consumer) {
        await this.consumerRepository.updateById(currentInfluencer.user.consumer.id, { measurement: influencer_measurment['id'] });
      }
    }

    return {
      msg: 'Influencer Measurements Added',
    };
  }

  async findByUserId(userId) {
    return await this.influencerRepository.findInfluncerByUserId(userId);
  }

  async markPotential(userId, params) {
    const influencer = await this.influencerRepository.findInfluncerByUserId(userId);
    if (!influencer) {
      throw new NotFoundException(`Influencer with user ID "${userId}" not found`);
    }
    let payload = {};
    let candidates = influencer.potentialBrands;
    if (!candidates) {
      candidates = [];
    }
    const brandId = Number(params.brandId);

    if (!params.isMarked) {
      if (brandId) {
        candidates.push(brandId);
        candidates = Array.from(new Set(candidates));
      }
    } else {
      candidates = candidates.filter((value) => value !== brandId);
    }
    payload['potentialBrands'] = candidates;

    const payloadNew: Partial<Influencers> = payload;
    const isUpdated = await this.influencerRepository.updateById(influencer.id, payloadNew);
    if (isUpdated.affected == 1) {
      const savedInfluencer = await this.influencerRepository.findOne(influencer.id);
      if (savedInfluencer) {
        return savedInfluencer;
      } else {
        throw new Error('Something went wrong');
      }
    } else {
      throw new Error('Failed: Something went wrong');
    }
  }

  async findMeasurementsByInfluencerId(id: number) {
    return this.influencerRepository.findMeasurementsByInfluencerId(id);
  }

  async fetchInfluencerMeasurements(userId: number) {
    const influencer = await this.influencerRepository.findByUserId(userId);
    const consumer = await this.consumerRepository.findByUserId(userId);
    let measurementRecord;
    if (!influencer && !consumer) throw new NotFoundException('Influencer not foumd');
    if (influencer) {
      measurementRecord = influencer.measurement;
    }
    if (consumer) {
      measurementRecord = consumer.measurement;
    }
    return { measurements: measurementRecord?.measurements, input: measurementRecord?.input?.photoScan };
  }

  async updateInfluencerMeasurements(userId: number, updateInfluencerMeasurements: UpdateMeasurementDto) {
    const influencer = await this.influencerRepository.findByUserId(userId);
    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!influencer && !consumer) throw new NotFoundException('USER types not found');
    let existingMeasurement;

    if (influencer) {
      existingMeasurement = influencer.measurement;
    } else if (consumer) {
      existingMeasurement = consumer.measurement;
    }

    if (!existingMeasurement) throw new NotFoundException('Body measurement not found');

    const updatePayload = await this.createUpdatePayload(updateInfluencerMeasurements, existingMeasurement);
    await this.bodyMeasurementUseCase.getInstance().update(existingMeasurement.id, updatePayload);
    return { message: 'measurements updated' };
  }

  async createUpdatePayload(updateInfluencerMeasurements: UpdateMeasurementDto, existingMeasurement: BodyMeasurement) {
    let inputData = updateInfluencerMeasurements.input;
    const existingPhotoScan = existingMeasurement.input?.photoScan;

    !inputData.rightPhoto && existingPhotoScan?.rightPhoto !== undefined && (inputData.rightPhoto = existingPhotoScan.rightPhoto);
    !inputData.frontPhoto && existingPhotoScan?.frontPhoto !== undefined && (inputData.frontPhoto = existingPhotoScan.frontPhoto);

    const updatePayload: Partial<BodyMeasurement> = {
      input: { photoScan: inputData },
      measurements: updateInfluencerMeasurements.measurements,
    };

    return updatePayload;
  }
}
