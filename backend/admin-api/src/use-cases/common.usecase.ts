import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { CategoryRepository } from '@infrastructure/orm/reposiories/category.repository';
import { ContactUsRepository } from '@infrastructure/orm/reposiories/contact-us.repository';
import { EmailCapturedForIOSRepository } from '@infrastructure/orm/reposiories/email-capture-for-ios.repository';
import { GenderRepository } from '@infrastructure/orm/reposiories/gender.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { SizeRepository } from '@infrastructure/orm/reposiories/size.repository';
import { StyleRepository } from '@infrastructure/orm/reposiories/style.repository';
import { SubCategoryRepository } from '@infrastructure/orm/reposiories/sub-category.repository';
import { questions_options, questions_options_minor } from 'constants/questionnaire';
import { CreateContactUs } from '@infrastructure/presentation/common/common.dto';
import { Inject, NotFoundException, Query } from '@nestjs/common';
import { InstagramUsecase } from './instagram.usecase';
import { PostsUsecase } from './posts.usecase';
import UsecaseProxy, { INSTAGRAM_USECASE_PROXY, POST_USECASE_PROXY, USER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { TwilioService } from '@infrastructure/services/twilio/twilio.service';
import { SubscriberRepository } from '@infrastructure/orm/reposiories/subscriber.repository';
import { Page } from '@infrastructure/orm/entities/subscriber.entity';
import { AffliateProductableRepository } from '@infrastructure/orm/reposiories/affliate-productable.repository';
import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { GENDER_QUESTIONS_SR_NO, STYLE_QUESTIONS_SR_NO, STYLE_QUESTIONS_SR_NO_MINOR } from '@infrastructure/utils/constant';
import { UserUsecase } from './user.usecase';
import { MediaDto } from '@infrastructure/presentation/post/create-post.dto';
const _ = require('lodash');

export class CommonUsecase {
  constructor(
    private categoryRepo: CategoryRepository,
    private styleRepo: StyleRepository,
    private subCategoryRepo: SubCategoryRepository,
    private sizeRepo: SizeRepository,
    private genderRepo: GenderRepository,
    private questionnaireRepository: QuestionnaireRepository,
    private contactUsRepository: ContactUsRepository,
    private emailCaptureRepository: EmailCapturedForIOSRepository,
    private influencerRepository: InfluencerRepository,
    @Inject(INSTAGRAM_USECASE_PROXY)
    private instagramUsecase: UsecaseProxy<InstagramUsecase>,
    @Inject(POST_USECASE_PROXY)
    private postUsecase: UsecaseProxy<PostsUsecase>,
    private mailgunService: MailGunService,
    private twilioService: TwilioService,
    private subscriberRepository: SubscriberRepository,
    private affliateProductableRepository: AffliateProductableRepository,
    private userRepository: UserRepository,
    private affiliateWeeklyReportRepository: AffiliateReportRepository,
    @Inject(USER_USECASE_PROXY)
    private userUsecase: UsecaseProxy<UserUsecase>,
  ) {}

  async findAllCategories() {
    return await this.categoryRepo.findAll();
  }

  async findAllStyles() {
    return await this.styleRepo.findAll();
  }

  async getUserAgeAndType(userRepository: UserRepository, userId: number) {
    const getUser = await userRepository.findById(userId);
    const birthDate = new Date(getUser?.dob ?? new Date());
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0);
    const isAdult = isBeforeBirthday ? age - 1 >= 18 : age >= 18;

    let userType = UserType.INFLUENCER;
    if (!isAdult && getUser?.dob) {
      userType = UserType.MINORINFLUENCER;
    }

    return {
      getUser,
      age: isBeforeBirthday ? age - 1 : age,
      isAdult,
      userType,
    };
  }
  async isMinor(user: { dob?: Date }) {
    if (!user?.dob) {
      return false;
    }

    const birthDate = new Date(user.dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age < 18;
  }

  async findSubCategoryByGenderAndCategory(categoryId: number, genderId: number) {
    return await this.subCategoryRepo.findByGenderAndCategory(categoryId, genderId);
  }

  async findSizesBySubCategory(subCategoryId: number) {
    return await this.sizeRepo.findBySubCategory(subCategoryId);
  }

  async findAllGenders() {
    return await this.genderRepo.findAll();
  }

  async findSubCategory(id) {
    return await this.subCategoryRepo.findById(id);
  }

  async findAllQuestions(user_type: string) {
    return this.questionnaireRepository.getAllQuestions(user_type);
  }

  async getAllQuestionnaire(user_type: UserType, userId: number) {
    if (user_type === UserType.BRAND) {
      return this.questionnaireRepository.getAllQuestions(user_type);
    }
    const questions = await this.questionnaireRepository.getAllQuestionnaire(userId, user_type, true);
    const mappedQuestions = await this.mapOptions(questions, questions_options);

    const groupedQuestions = _.groupBy(mappedQuestions, 'question_category_sr_no');
    const sortedQuestions = this.sortQuestionsByCategory(groupedQuestions);

    return {
      data: sortedQuestions,
    };
  }

  async getAllInfluencerQuestionnaire(userId: number, includeAll = false) {
    const selected_attributes = {
      id: true,
      address: true,
      city: true,
      state: true,
      zip_code: true,
      dob: true,
      influencer: {
        id: true,
        audience_region: true,
      },
    };
    const user = await this.userUsecase.getInstance().findUserByConditionwithRelation({ id: userId }, ['influencer'], selected_attributes);
    if (!user) {
      throw new NotFoundException(`Failed to get User`);
    }
    const userIsMinor = await this.isMinor(user);

    let userType = UserType.INFLUENCER;
    if (userIsMinor === true) {
      userType = UserType.MINORINFLUENCER;
    }
    const raw = await this.questionnaireRepository.getAllQuestionnaire(userId, userType, includeAll);
    let mapped;
    if (userIsMinor === true) {
      // Using userIsMinor
      mapped = await this.mapOptions(raw, questions_options_minor);
    } else {
      mapped = await this.mapOptions(raw, questions_options);
    }
    const filtered = this.filterStyleAndGender(mapped, includeAll, userType);
    const sorted = filtered.sort((a, b) => a.sr_no - b.sr_no);
    return {
      userInfo: user,
      questionnaire: sorted,
    };
  }

  private filterStyleAndGender(questions, includeAll: boolean, userType: string) {
    const base = includeAll ? [...questions] : questions.filter((q) => q.user_answer.length === 0);
    let hasAllStyles;
    let withoutStyles;
    if (userType == UserType.INFLUENCER) {
      hasAllStyles = STYLE_QUESTIONS_SR_NO.every((no) => base.some((q) => q.sr_no === no));

      withoutStyles = hasAllStyles ? base : base.filter((q) => !STYLE_QUESTIONS_SR_NO.includes(q.sr_no));
    } else {
      hasAllStyles = STYLE_QUESTIONS_SR_NO_MINOR.every((no) => base.some((q) => q.sr_no === no));

      withoutStyles = hasAllStyles ? base : base.filter((q) => !STYLE_QUESTIONS_SR_NO_MINOR.includes(q.sr_no));
    }

    if (hasAllStyles && !withoutStyles.some((q) => GENDER_QUESTIONS_SR_NO.includes(q.sr_no))) {
      const genderQ = questions.find((q) => GENDER_QUESTIONS_SR_NO.includes(q.sr_no));
      if (genderQ) withoutStyles.push(genderQ);
    }

    return withoutStyles;
  }

  sortQuestionsByCategory(data) {
    Object.keys(data).forEach((category) => {
      data[category] = _.sortBy(data[category], 'category_sub_question_sr_no');
    });
    return data;
  }

  async mapOptions(questions, optionsList) {
    return questions.map((question) => {
      const { sr_no } = question;
      const options = question.options.map((q_option) => {
        const isFound = optionsList.find((option) => option.option === q_option && option.sr_no === sr_no);
        let inputField;
        if (q_option === 'Other' || q_option === 'Other Regions' || q_option === 'Other Countries' || q_option === 'Other Cities') {
          inputField = {
            fieldName: isFound?.input_field?.fieldName || 'random',
            placeholder: isFound?.input_field?.placeholder || 'random',
          };
        }
        if (isFound) {
          return {
            option: q_option,
            option_discription: isFound.option_discription,
            image_url: isFound.image_url ?? '',
            ...(inputField && { input_field: inputField }),
            heading: isFound.heading,
          };
        }
        return {
          option: q_option,
          option_discription: '',
          image_url: '',
        };
      });
      // question.user_answer = question.user_answer?.length ? (question.user_answer[0].selected_options ?? []) : [];
      return { ...question, options };
    });
  }

  async createContactUs(payload: CreateContactUs) {
    const { first_name, last_name, email, your_question } = payload;

    const emailSubject = `Contact Us Form Submission: ${first_name} ${last_name}`;
    const emailBody = `
      Hello,

      You have received a new message from the Contact Us form on your website:

      - Name: ${first_name} ${last_name}
      - Email: ${email}
      - Question: ${your_question}

      Please feel free to respond to the user directly.

      Best regards,
      Your Website Team
    `;

    const resp = await this.mailgunService.sendEmail('ace@ubu.live', emailSubject, emailBody);

    return (await this.contactUsRepository.create(payload)) && 'Succesfully Submitted';
  }
  async createCaptureEmail(email: string) {
    return (await this.emailCaptureRepository.create({ email })) && 'Succesfully Captured';
  }

  async getInfluencerMedia(influencerId: number, source: string) {
    const influencer = await this.influencerRepository.findOne(influencerId);
    if (!influencer) {
      throw new NotFoundException('Influencer not Found');
    }
    if (source == 'ubu') {
      const posts = await this.postUsecase.getInstance().getPostMedia(influencer.id);
      return {
        data: posts
          .map((post) =>
            post.media.map((item: MediaDto) => ({
              media_url: item.url,
              media_type: item.type,
              extension: item.extension,
              placeholder: item.placeholder,
              // thumbnail: item.thumbnail, // Assuming there's a thumbnail field as well
            })),
          )
          .flat(),
      };
    } else {
      return await this.instagramUsecase.getInstance().getPosts(influencer.user.id);
    }
  }

  async sendAndSaveEmailToSubscriber(email: string, page: Page) {
    const emailBody = `
    <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
      <div style="text-align: center; padding: 10px 0; background-color: #000;">
        <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
          UBU
        </h1>
      </div>
      <div style="padding: 20px;">
        <h1 style="font-size: 24px; color: #000; text-align: center;">New updates coming soon</h1>
        <p style="font-size: 16px; line-height: 1.5; color: #333;">
           Thank you for subscribing. We’re thrilled to have you on board.
           Our team is working hard to finalize our features and modules, and you’ll be the first to know as soon as they’re ready.
          Stay tuned for exciting updates and enhancements coming your way!

        <p style="font-size: 16px; line-height: 1.5; color: #333;">
          Regards,<br>
          UBU Team
        </p>
      </div>
      <div style="text-align: center; padding: 10px; background-color: #f0f0f0;">
        <p style="font-size: 12px; color: #888;">UBU Corporation</p>
      </div>
    </div>
  `;
    try {
      const sentEmail = await this.mailgunService.sendEmail('ace@ubu.live', 'Thank You for Subscribing to UBU! Exciting Updates Coming Soon', emailBody, true);
      if (sentEmail.message) {
        const existingSubscriber = await this.subscriberRepository.findByCondition({
          email: email,
        });
        if (!existingSubscriber.length) {
          await this.subscriberRepository.createSubscriber(email, page);
        }
        return 'Thank You for Subscribing to UBU! Exciting Updates Coming Soon';
      } else {
        return 'Invalid Email. Please provide a valid Email.';
      }
    } catch (error) {
      console.error('Error in sendAndSaveEmailToSubscriber:', error);
      return error.response;
    }
  }

  async sendAndSavePhoneToSubscriber(phoneNumber: string, page: Page): Promise<string> {
    try {
      const messageResponse = await this.twilioService.sendMessage(phoneNumber, 'Thank You for Subscribing to UBU! Exciting Updates Coming Soon');
      if (messageResponse?.body) {
        const recipientPhone = messageResponse.to;
        const existingSubscriber = await this.subscriberRepository.findByCondition({
          phone_number: recipientPhone,
        });
        if (!existingSubscriber.length) {
          await this.subscriberRepository.createSubscriberUsingPhone(recipientPhone, page);
        }
        return messageResponse.body;
      } else {
        return 'Invalid phone number. Please provide a valid number.';
      }
    } catch (error) {
      console.error('Error in sendAndSavePhoneToSubscriber:', error);
      return error.response;
      // throw new Error("Failed to send message to subscriber. Please try again later.");
    }
  }

  async findAllProducts(page: number, limit: number, search?: string) {
    return await this.affliateProductableRepository.findAllProducts(page, limit, search);
  }

  async SignupUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string) {
    const pageSize = limit;
    const skip = (page - 1) * pageSize;

    return await this.userRepository.getAllListOfUsers(skip, pageSize, search);
  }

  async SubscribedUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('search') search?: string) {
    const pageSize = limit;
    const skip = (page - 1) * pageSize;

    return await this.subscriberRepository.findAllSubscribers(skip, pageSize, search);
  }
}
