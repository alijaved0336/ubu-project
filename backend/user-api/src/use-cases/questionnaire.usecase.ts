import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GENDER_QUESTIONS_SR_NO, QUESTIONS_SERIAL_NUMBERS, STYLE_QUESTIONS_SR_NO, STYLE_QUESTIONS_SR_NO_MINOR } from 'common/constants';
import { questions_options , questions_options_minor} from 'constants/questionnaire';
import { getUserAgeAndType } from './common.usecase';

@Injectable()
export class QuestionnaireUsecase {
  constructor(
    private questionnaireRepository: QuestionnaireRepository,
    private consumerRepository: ConsumerRepository,
    private userRepository: UserRepository,
  ) { }

  async questionnaireSubmit(user, answers) {
    const addedAnswers = await this.addAnswer(user, answers);
    if (addedAnswers)
    {
      return await this.consumerRepository.updateConsumerData(user)
    }
  }

  async addAnswer(user, answers) {
    const mapedAnswers = answers.map((answer) => {
      return {
        user,
        ...answer
      }
    })
    return await this.questionnaireRepository.addAnswer(mapedAnswers);
  }

  async mapOptions(questions, optionsList) {
    return questions.map((question) => {
      const options = question.options.map((q_option) => {
        const isFound = optionsList.find((option) => {
          if (option.title === question.title)
          {
            if (option.question_category === question.question_category)
            {
              if (option.option === q_option)
              {
                return option;
              }
              return false;
            }
          }
        });
  
        let inputField;
        if (q_option === 'Other' || q_option === 'Other Regions' || q_option === 'Other Countries' || q_option === 'Other Cities') {
          inputField = {
            fieldName: isFound?.input_field?.fieldName || 'random',
            placeholder: isFound?.input_field?.placeholder || 'random',
          };
        }
  
        if (isFound)
        {
          return {
            option: q_option,
            option_discription: isFound.option_discription,
            ...(inputField && { input_field: inputField }),
            heading: isFound.heading
          };
        }
        return {
          option: q_option,
          option_discription: '',
          ...(inputField && { input_field: inputField }),
          heading: '',
        };
      });
  
      question.options = options;
  
      // Set user_answer as array of selected_options or []
      question.user_answer = question.user_answer?.length
        ? question.user_answer[0].selected_options ?? []
        : [];
  
      return question;
    });
  }



  public async findAll(
    userId: number,
    includeAll = false
  ) {
    if (!userId)
    {
      return 'Consumer not scanned';
    }
    const user = await this.userRepository.findById(userId)
    if (!user)
    {
        throw new UnauthorizedException('Invalid token User not found');
    }

    const { getUser, userType, isAdult }  = await getUserAgeAndType(this.userRepository, user.id);
               
    if (!getUser) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
    }
    const raw = await this.questionnaireRepository.findAllQuestionnaires(getUser.id, userType);
    let mapped; 
    let filtered;
    if (!isAdult && getUser?.dob) {
        mapped= await this.mapOptions(raw, questions_options_minor);
        filtered = this.filterStyleAndGender(mapped, includeAll, STYLE_QUESTIONS_SR_NO_MINOR);
    }
    else
    {
        mapped= await this.mapOptions(raw, questions_options);
        filtered = this.filterStyleAndGender(mapped, includeAll, STYLE_QUESTIONS_SR_NO);
    }
    const sorted = filtered.sort((a, b) => a.sr_no - b.sr_no);

    return {
      total_questions: sorted.length,
      sortedQuestions: sorted,
    };
  }

  private filterStyleAndGender(
    questions,
    includeAll: boolean,
    sr_nos
  ) {
    const base = includeAll
      ? [...questions]
      : questions.filter(q => q.user_answer.length === 0);

    const hasAllStyles = sr_nos.every(no =>
      base.some(q => q.sr_no === no)
    );

    const withoutStyles = hasAllStyles
      ? base
      : base.filter(q => !sr_nos.includes(q.sr_no));

    if (hasAllStyles && !withoutStyles.some(q => GENDER_QUESTIONS_SR_NO.includes(q.sr_no)))
    {
      const genderQ = questions.find(q => GENDER_QUESTIONS_SR_NO.includes(q.sr_no));
      if (genderQ) withoutStyles.push(genderQ);
    }

    return withoutStyles;
  }

  async findAllQuestionnairess(userTypes: UserType[]) {
    return this.questionnaireRepository.findAllQuestionnairess(userTypes);
  }

  async findQuestionnairesBasedOnSrNo(srNos: number[]) {
    return this.questionnaireRepository.findQuestionnairesBasedOnSrNo(srNos);
  }

  async isSurveyDoneForCurrentUserType(userId: number, userType: UserType) {
    const userQuestionsAnswers =
      await this.questionnaireRepository.findAllQuestionnairesWithAnswersForUser(
        userId,
        userType,
      );

    const hasUnansweredRequiredQuestion = userQuestionsAnswers.some(
      (question) =>
        !question.is_optional &&
        (!question.user_answer || question.user_answer.length === 0),
    );

    return !hasUnansweredRequiredQuestion;
  }

  async getDropdownoptionsforConsumerProfile(id) {
    const user = await this.userRepository.findById(id)

    if (!user) throw new NotFoundException('User Not Found')

    const { getUser, userType } = await getUserAgeAndType(this.userRepository, user.id);
    if (!getUser) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
    }
    const questions = await this.questionnaireRepository.findAllQuestionnairess(
     [userType],
    );

    const result = {};

    questions.forEach((question) => {
      const { sr_no, options } = question;

      const matchedKey = Object.keys(QUESTIONS_SERIAL_NUMBERS).find(
        (key) => QUESTIONS_SERIAL_NUMBERS[key] === sr_no,
      );

      if (matchedKey)
      {
        result[matchedKey] = {
          srNo: sr_no,
          options: options || [],
        };
      }
    });

    return result;
  }

  async findAllQuestionnairesWithAnswersForUser(
    userId: number,
    userType: UserType,
  ) {
    return await this.questionnaireRepository.findAllQuestionnairesWithAnswersForUser(
      userId,
      userType,
    );
  }
}
