import { Inject } from '@nestjs/common';
import { QuestionnaireUsecase } from './questionnaire.usecase';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { UserAnswerRepository } from '@infrastructure/orm/reposiories/user-answer.repository';

import UsecaseProxy, {
  QUESTIONNAIRE_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export class UserAnswersUsecase {
  constructor(
    private userAnswersRepository: UserAnswerRepository,
    @Inject(QUESTIONNAIRE_USECASE_PROXY)
    private readonly questionnaireUseCase: UsecaseProxy<QuestionnaireUsecase>,
  ) {}

  async submitUserAnswers(user, answers) {
    return await this.handleUserAnswers(answers, user);
  }

  async handleUserAnswers(answers, user, allowDelete = false) {
   const userTypeForQuestions: UserType[] = [];
    const birthDate = new Date(user?.dob ?? new Date());
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0);
    const isAdult = isBeforeBirthday && user?.dob ? age >= 18 : age >= 18;

    let userType: UserType = UserType.BRAND;
    if (user.is_consumer) {
      if (!isAdult && user?.dob) {
        userTypeForQuestions.push(UserType.MINORCONSUMER);
      } else {
        userTypeForQuestions.push(UserType.CONSUMER);
      }
    }
    if (user.is_brand) {
      userTypeForQuestions.push(UserType.BRAND);
    }
    if (user.is_influencer) {
      if (!isAdult && user?.dob) {
        userTypeForQuestions.push(UserType.MINORINFLUENCER);
      } else {
        userTypeForQuestions.push(UserType.INFLUENCER);
      }
    }

    const questions = await this.questionnaireUseCase
      .getInstance()
      .findAllQuestionnairess(userTypeForQuestions);

    for (const question of questions) {
      const { sr_no, id: questionId } = question;
      const matchingAnswer = answers.find(
        (answer) => Number(answer.srNo) === sr_no,
      );

      if (!matchingAnswer) {
        if (allowDelete)
          await this.deleteSpecificUserAnswer(user.id, questionId);
      }

      if (matchingAnswer) {
        await this.addOrUpdateAnswer({
          user: { id: user.id },
          question: { id: questionId },
          selected_options: Array.isArray(matchingAnswer.selected_options)
            ? matchingAnswer.selected_options
            : [matchingAnswer.selected_options],
        });
      }
    }

    return {
      statusCode: 200,
      message: 'Survey saved successfully',
    };
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  async addOrUpdateAnswer(payload) {
    const existingAnswer = await this.userAnswersRepository.findOne(
      payload.user.id,
      payload.question.id,
    );

    if (existingAnswer) {
      return await this.userAnswersRepository.update(
        payload.user.id,
        payload.question.id,
        payload,
      );
    } else {
      return await this.userAnswersRepository.save(payload);
    }
  }

  async deleteSpecificUserAnswer(userId: number, questionId: number) {
    return this.userAnswersRepository.deleteSpecificUserAnswer(
      userId,
      questionId,
    );
  }

  async isSurveyDoneForCurrentUserType(userId: number, userType: UserType) {
    return await this.questionnaireUseCase
      .getInstance()
      .isSurveyDoneForCurrentUserType(userId, userType);
  }
}
