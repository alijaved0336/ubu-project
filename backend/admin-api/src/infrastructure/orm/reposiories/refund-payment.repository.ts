import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Refund } from '../entities/refund.entity';

export class RefundPaymentRepository {
  constructor(
    @InjectRepository(Refund)
    private readonly refundPaymentRepository: Repository<Refund>,
  ) {}

  async addRefundPayment(payload: Partial<Refund>, queryRunner?: QueryRunner) {
    const refundRepo = queryRunner ? queryRunner?.manager.getRepository(Refund) : this.refundPaymentRepository;
    const refundPayment = refundRepo?.create(payload);
    return refundRepo?.save(refundPayment);
  }

  async getRefundInfo(condition) {
    return this.refundPaymentRepository.findOne({ where: condition });
  }

  async save(payload, repository, queryRepo?, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager.getRepository(queryRepo) : this[`${repository}`];
    return repo.save(payload);
  }
}
