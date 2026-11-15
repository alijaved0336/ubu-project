import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAnswer } from '../entities/user-answer.entity';

@Injectable()
export class UserAnswerRepository {
  constructor(
    @InjectRepository(UserAnswer)
    private readonly userAnswerRepository: Repository<UserAnswer>,
  ) {}

  async create(payload: Partial<UserAnswer>) {
    const user_answer_attempted = this.userAnswerRepository.create(payload);
    return this.userAnswerRepository.save(user_answer_attempted);
  }

  async findOne(
    userId: number,
    questionId: number,
  ): Promise<UserAnswer | null> {
    return await this.userAnswerRepository.findOne({
      where: {
        user: { id: userId },
        question: { id: questionId },
      },
    });
  }

  async update(
    userId: number,
    questionId: number,
    payload: Partial<UserAnswer>,
  ) {
    return await this.userAnswerRepository.update(
      { user: { id: userId }, question: { id: questionId } },
      payload,
    );
  }

  async save(payload: Partial<UserAnswer>): Promise<UserAnswer> {
    return this.userAnswerRepository.save(payload);
  }

  async deleteSpecificUserAnswer(userId: number, questionId: number) {
    await this.userAnswerRepository.delete({
      user: { id: userId },
      question: { id: questionId },
    });
  }
}
