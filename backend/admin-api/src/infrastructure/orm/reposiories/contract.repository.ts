import { ICampaignRepository } from '@domain/repository/campaign.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../entities/contract.entity';
import { IContractRepository } from '@domain/repository/contract.repository.interface';
export class ContractRepository implements IContractRepository {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async create(data: Partial<Contract>) {
    return await this.contractRepository.create(data);
  }

  async save(data: Contract): Promise<Contract> {
    return await this.contractRepository.save(data);
  }

  // async findOne(id) {
  //   return await this.contractRepository.findOne({ where: { id } });
  // }

  async findByCampaignId(campaignId: number) {
    return await this.contractRepository.findOne({
      where: { campaign: { id: campaignId } },
    });
  }

  async findOne(id: number) {
    return await this.contractRepository.findOne({
      where: { id },
    });
  }
}
