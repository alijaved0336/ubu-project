import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import { Affiliate } from '@infrastructure/orm/entities/affiliate.entity';
import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { PopulateQuestionnaire } from './populate-questionnaire.command';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { influencer_questions } from './influencer-questionnaire';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';

@Injectable()
export class bulkInsertAffiliates {
  logger = new Logger(PopulateQuestionnaire.name);
  constructor(private readonly affliateRepo: AffliateRepository) {}

  @Command({
    command: 'populate-affliate_ids',
    describe: 'populateing questionnaires',
  })
  async populate() {
    console.log("I'm callllllededded ...");
    const affiliates = [
      {
        affiliate_id: 'affiliate-1', // First entry
      },
      {
        affiliate_id: 'affiliate-2',
      },
      {
        affiliate_id: 'affiliate-3', // Third entry
      },
      {
        affiliate_id: 'affiliate-4',
      },
      {
        affiliate_id: 'affiliate-5', // Fifth entry
      },
      {
        affiliate_id: 'affiliate-6000',
      },
      {
        affiliate_id: 'affiliate-7', // Seventh entry
      },
      {
        affiliate_id: 'affiliate-dsds8',
      },
      {
        affiliate_id: 'affiliate-9', // Ninth entry
      },
      {
        affiliate_id: 'affiliate-10',
      },
    ];

    try {
      const savedAffiliates = await this.affliateRepo.create(affiliates);
      console.log('Affiliates saved successfully:', savedAffiliates);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        console.error('Duplicate affiliate_id found:', error.detail);
      } else {
        console.error('Error saving affiliates:', error);
      }
    }

    this.logger.log('-------------------Affiliates populated-------------');
  }
}
