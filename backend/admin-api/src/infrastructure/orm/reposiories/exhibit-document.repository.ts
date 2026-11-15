import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitDocument } from '../entities/exhibit-document.entity';
import { IExhibitDocumentRepository } from '@domain/repository/exhibit-document.repository.interface';

export class ExhibitDocumentRepository implements IExhibitDocumentRepository {
  constructor(
    @InjectRepository(ExhibitDocument)
    private readonly exhibitDocumentRepository: Repository<ExhibitDocument>,
  ) {}

  async create(data: Partial<ExhibitDocument>) {
    return await this.exhibitDocumentRepository.create(data);
  }

  async save(exhibit_document: ExhibitDocument): Promise<ExhibitDocument> {
    return await this.exhibitDocumentRepository.save(exhibit_document);
  }

  async findAllExceptOneByCampaignId(campaignId, exceptId) {
    return await this.exhibitDocumentRepository
      .createQueryBuilder('exhibitDocument')
      .where('exhibitDocument.campaignId = :campaignId', { campaignId })
      .andWhere('exhibitDocument.id != :exceptId', { exceptId })
      .getMany();
  }

  async findOne(id) {
    return await this.exhibitDocumentRepository.findOne({ where: { id } });
  }

  async findByCampaignId(campaignId: number) {
    return await this.exhibitDocumentRepository.findOne({ where: { campaignId } });
  }

  async getLatestExhibitDocumentByCampaignId(campaignId: number | string) {
    return await this.exhibitDocumentRepository
      .createQueryBuilder('exhibitDocument')
      .where('exhibitDocument.campaignId = :campaignId', { campaignId })
      .orderBy('exhibitDocument.documentOrder', 'DESC')
      .getOne();
  }
}
