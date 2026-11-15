import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Questionnaires, UserType } from '../entities/questionnaire.entity';
import { UserAnswer } from '../entities/user-answer.entity';

@Injectable()
export class QuestionnaireRepository {
  constructor(
    @InjectRepository(Questionnaires)
    private readonly questionnaireRepository: Repository<Questionnaires>,

    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
  ) {}

  async addAnswer(answers) {
    return this.userAnswerRepository.insert(answers);
  }

  async findAllQuestionnaires(userId: number, userType: UserType) {
    const answers = await this.userAnswerRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['question'],
    });

    const answeredSrNos = new Set(
      answers
        .filter((ans) => ans.question?.sr_no !== undefined)
        .map((ans) => ans.question.sr_no),
    );
    const questionnaires = await this.questionnaireRepository
      .createQueryBuilder('questionnaire')
      .leftJoinAndSelect(
        'questionnaire.user_answer',
        'user_answer',
        'user_answer.user_id = :userId',
        { userId },
      )
      .where('questionnaire.user_type = :userType', {
        userType: userType,
      })
      .getMany();
    const filtered = questionnaires.filter((q) => !answeredSrNos.has(q.sr_no));
    return filtered;
  }

  async findQuestionnairesBasedOnSrNo(srNos: number[]) {
    return this.questionnaireRepository.find({
      where: {
        sr_no: In(srNos),
      },
    });
  }

  async findAllQuestionnairess(userTypes: UserType[]) {
    return this.questionnaireRepository.find({
      where: {
        user_type: In(userTypes),
      },
    });
  }

  async seederQUestionnaire(questions) {
    await this.questionnaireRepository.save(questions);
    console.log('Seed data inserted successfully');
  }

  async removeUsersAnswers(userId) {
    return this.userAnswerRepository.delete({
      user: {
        id: userId,
      },
    });
  }

  async isConsumerSurveyCompleted(userId) {
    const survey = await this.userAnswerRepository.find({
      where: {
        user: {
          id: userId,
        },
        question: {
          user_type: UserType.CONSUMER,
        },
      },
      relations: ['user', 'question'],
    });
    if (survey.length) {
      return true;
    }
    return false;
  }

  async findAllQuestionnairesWithAnswersForUser(
    userId: number,
    userType: UserType,
  ) {
    return this.questionnaireRepository
      .createQueryBuilder('questionnaire')
      .leftJoinAndSelect(
        'questionnaire.user_answer',
        'user_answer',
        'user_answer.user_id = :userId',
        { userId },
      )
      .where('questionnaire.user_type = :userType', { userType })
      .getMany();
  }
}
