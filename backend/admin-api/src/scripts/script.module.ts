import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PopulateQuestionnaire } from './populate-questionnaire.command';
import { DataSource } from 'typeorm';
import { DatabaseOrmConfigModule } from '@infrastructure/config/database-orm-config/database-orm-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnaires } from '@infrastructure/orm/entities/questionnaire.entity';
import { RepositoriesModule } from '@infrastructure/orm/reposiories/repository.module';
import { Affiliate } from '@infrastructure/orm/entities/affiliate.entity';
import { bulkInsertAffiliates } from './affliate_ids';
import { AffliateRepository } from '@infrastructure/orm/reposiories/affliate.repository';

@Module({
  imports: [CommandModule, RepositoriesModule],
  controllers: [],
  providers: [PopulateQuestionnaire, bulkInsertAffiliates],
})
export class ScriptModule {}
