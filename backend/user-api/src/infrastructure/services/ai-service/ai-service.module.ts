// mailer.module.ts
import { Module } from '@nestjs/common'
import { AiService } from './ai-service.service';
import { RepositoriesModule } from '../../orm/reposiories/repository.module';
import { DatabaseOrmConfigModule } from '@infrastructure/config/database-orm-config/database-orm-config.module';
import { Influencers } from '@infrastructure/orm/entities/influencer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [DatabaseOrmConfigModule,
        TypeOrmModule.forFeature([Influencers])
    ],
    providers: [AiService,],
    exports: [AiService]
})
export class AiServiceModule { }
