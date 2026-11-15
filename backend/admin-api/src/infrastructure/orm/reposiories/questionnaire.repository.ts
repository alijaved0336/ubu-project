import { Questionnaires, UserType } from '@infrastructure/orm/entities/questionnaire.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserAnswer } from '../entities/user-answer.entity';

@Injectable()
export class QuestionnaireRepository {
  constructor(
    @InjectRepository(Questionnaires)
    private readonly questionnaireRepository: Repository<Questionnaires>,
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
  ) {}

  async insert(questions: Partial<Questionnaires>[]) {
    return this.questionnaireRepository.save(questions);
  }

  async getAllQuestions(user_type: string) {
    return this.questionnaireRepository.find({
      where: {
        // eslint-disable-next-line no-nested-ternary
        user_type: UserType.BRAND === user_type ? UserType.BRAND : UserType.MINORINFLUENCER === user_type ? UserType.MINORINFLUENCER : UserType.INFLUENCER,
      },
    });
  }

  async getAllQuestionsByIds(ids: number[]) {
    return this.questionnaireRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async getAllQuestionnaire(userId: number, userType: UserType, includeAll: boolean = false) {
    const answers = await this.userAnswerRepository.find({
      where: { user: { id: userId } },
      relations: ['question'],
    });

    let answeredSrNos = new Set(answers.filter((ans) => ans.question?.sr_no !== undefined).map((ans) => ans.question.sr_no));

    if (includeAll) {
      answeredSrNos = new Set();
    }

    const questionnaires = await this.questionnaireRepository
      .createQueryBuilder('questionnaire')
      .leftJoinAndSelect('questionnaire.user_answer', 'user_answer', 'user_answer.user_id = :userId', { userId })
      .where('questionnaire.user_type = :userType', { userType })
      .getMany();

    const mapped = questionnaires.map((q) => {
      const qAnswers = answers.filter((a) => a.question?.sr_no === q.sr_no);
      const allOptions = qAnswers.flatMap((a) => a.selected_options || []);
      return {
        ...q,
        user_answer: allOptions,
      };
    });

    const filtered = mapped.filter((q) => !answeredSrNos.has(q.sr_no));
    return filtered;
  }

  async getByTitle(titlesArray) {
    const questionnaire = this.questionnaireRepository
      .createQueryBuilder('questionnaires')
      .where('questionnaires.title ILIKE ANY(:titles)', { titles: titlesArray })
      .andWhere('questionnaires.user_type = :user_type', { user_type: 'influencer' });
    return await questionnaire.getMany();
  }

  async getInfluencerQuestionsBySrNos(sr_numbers: number[]) {
    return this.questionnaireRepository.find({
      where: {
        sr_no: In(sr_numbers),
        user_type: UserType.INFLUENCER || UserType.MINORINFLUENCER,
      },
    });
  }

  async getAllSegmentQuestions() {
    return this.questionnaireRepository.find({ where: { user_type: UserType.SEGMENT } });
  }

  async findAllQuestionnaires(userTypes: UserType[]) {
    return this.questionnaireRepository.find({
      where: {
        user_type: In(userTypes),
      },
    });
  }

  async findAllQuestionnairesWithAnswersForUser(userId: number, userType: UserType) {
    // if there are mandatory fields with no answer then survey is not done.
    return this.questionnaireRepository
      .createQueryBuilder('questionnaire')
      .leftJoinAndSelect('questionnaire.user_answer', 'user_answer', 'user_answer.user_id = :userId', { userId })
      .where('questionnaire.user_type = :userType', { userType })
      .getMany();
  }

  async findQuestionnairesBasedOnSrNo(srNos: number[]) {
    return this.questionnaireRepository.find({
      where: {
        sr_no: In(srNos),
      },
    });
  }
}
