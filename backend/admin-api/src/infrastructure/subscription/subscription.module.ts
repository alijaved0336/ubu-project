// src/modules/subscription/subscription.module.ts
import { Module } from '@nestjs/common';
import { SubscriptionGuard } from '../guards/subscription.guard';
import { APP_GUARD } from '@nestjs/core';
import { ProductController } from '@infrastructure/presentation/product/product.controller';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@infrastructure/orm/entities/user.entity';
import { DatabaseOrmConfigModule } from '@infrastructure/config/database-orm-config/database-orm-config.module';
import { UBUSubscription } from '@infrastructure/orm/entities/ubuSubscription.entity';

@Module({
  imports: [DatabaseOrmConfigModule, InfrastructureUsecasesBridgeModule.register(), TypeOrmModule.forFeature([User, UBUSubscription])],
  controllers: [ProductController],
  providers: [
    SubscriptionService,
    {
      provide: APP_GUARD,
      useClass: SubscriptionGuard,
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
