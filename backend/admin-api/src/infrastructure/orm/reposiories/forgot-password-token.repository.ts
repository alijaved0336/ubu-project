import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPasswordToken } from '../entities/forgot-password-token.entity';

@Injectable()
export class ForgotPasswordTokenRepository {
  constructor(
    @InjectRepository(ForgotPasswordToken)
    private readonly forgotPasswordTokenRepository: Repository<ForgotPasswordToken>,
  ) {}

  async create(payload) {
    const passwordToken = this.forgotPasswordTokenRepository.create(payload);
    return (await this.forgotPasswordTokenRepository.save(passwordToken)) && passwordToken;
  }

  async findOne(conditions, relations) {
    return this.forgotPasswordTokenRepository.findOne({
      where: conditions,
      relations,
    });
  }

  delete(user_id: number) {
    return this.forgotPasswordTokenRepository.delete({
      user: {
        id: user_id,
      },
    });
  }
}
