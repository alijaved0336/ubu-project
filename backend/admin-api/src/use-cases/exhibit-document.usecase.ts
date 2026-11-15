import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { ExhibitDocumentRepository } from '@infrastructure/orm/reposiories/exhibit-document.repository';
import { CreateExhibitDocumentDto } from '../infrastructure/presentation/exhibit-documents/exhibit-documents.dto';

@Injectable()
export class ExhibitDocumentUsecase {
  constructor(
    @InjectRepository(CampaignRepository)
    private readonly campaignRepository: CampaignRepository,
    private readonly exhibitDocumentRepository: ExhibitDocumentRepository,
    private readonly influencerRepository: InfluencerRepository,
    private readonly brandRepository: BrandRepository,
  ) {}
  async createExhibitDocumentRecord(payload: CreateExhibitDocumentDto, campaignId) {
    const campaign = await this.campaignRepository.getOneWithLatestDocument(campaignId);

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }
    const document_order = campaign.exhibitDocuments?.[0]?.documentOrder ?? 0;

    const exhibitDocument = await this.exhibitDocumentRepository.create({
      campaignId: campaignId,
      campaign, // Also setting the relation
      documentOrder: document_order + 1, //initially set to one
      description: payload.description,
      hashtags: payload.hashtags,
      numberOfDeliverables: payload.numberOfDeliverables,
      campaignAcceptanceDeadline: payload.campaignAcceptanceDeadline,
      publicationDates: payload.publicationDates,
      totalCompensation: payload.totalCompensation,
      brandGuidelines: payload.brandGuidelines,
      numberOfRevisions: payload.revisions?.number,
      turnAroundTime: payload.revisions?.turnaroundTime,
      specialConditions: payload.specialConditions,
      documentUrl: payload.documentUrl,
      advertisemntUrl: payload.advertisemntUrl,
      additionalRequirements: payload.additionalRequirements,
      productId: payload.productId,
    });
    return await this.exhibitDocumentRepository.save(exhibitDocument);
  }

  async getHistoryData(campaignId, body) {
    return await this.exhibitDocumentRepository.findAllExceptOneByCampaignId(campaignId, body.except_id);
  }

  async findOne(id) {
    return await this.exhibitDocumentRepository.findOne(id);
  }

  async getLatestExhibitDocumentByCampaignId(campaignId: number | string) {
    return await this.exhibitDocumentRepository.getLatestExhibitDocumentByCampaignId(campaignId);
  }
}
