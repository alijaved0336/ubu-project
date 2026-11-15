import {Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialIntegration } from '@infrastructure/orm/entities/social-integration.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { SocialIntegrationRepository } from '@infrastructure/orm/reposiories/social-integration.repository';
import { Repository, LessThan} from 'typeorm';

export class SocialIntegrationService implements OnModuleInit{
  constructor( 
    @InjectRepository(SocialIntegration)
    private readonly socialIntegrationRepository: Repository<SocialIntegration>,
  ){}

  onModuleInit() {
    console.log('-------register-----')
  }


  private readonly logger = new Logger(SocialIntegrationService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Cron expression for running every minute
  async handleCron() {
    const instagramIntegrations = await this.findInstagramIntegrationsUpdated57DaysAgo()
    for (const integration of instagramIntegrations) {
      try {
        await this.processIntegration(integration);
      } catch (error) {
        this.logger.error(`Error processing integration: ${integration.id}`, error.stack);
      }
    }
  }

  async findInstagramIntegrationsUpdated57DaysAgo(): Promise<SocialIntegration[]> {
    const fiftySevenDaysAgo = new Date();
    fiftySevenDaysAgo.setDate(fiftySevenDaysAgo.getDate() - 57);

    const integrations = await this.socialIntegrationRepository.find({
      where: {
        social_platform_name: 'Instagram',
        token_last_updated: LessThan(fiftySevenDaysAgo), // Use LessThan for date comparison
      },
    });
    
    this.logger.log(`Instagram integrations updated at least 57 days ago: ${integrations.length}`);
    this.logger.log(JSON.stringify(integrations, null, 2)); // Log entities as JSON
    return integrations
   
  }

  private async processIntegration(integration: SocialIntegration): Promise<void> {
    // Example task: Logging the ID of each integration
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${integration.access_token}`
    const longerToken: AxiosResponse<any> =  await axios.get(url)
    this.logger.log(`Old token: ${JSON.stringify(integration.access_token)}`);
    integration.access_token = longerToken.data.access_token
    this.socialIntegrationRepository.update(integration.id, integration)
    this.logger.log(`New token: ${JSON.stringify(integration.access_token)}`);
  }  
}
