import { Module } from '@nestjs/common';
import { StripeService } from './stripe-service.service';
import { DatabaseOrmConfigModule } from '@infrastructure/config/database-orm-config/database-orm-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@infrastructure/orm/entities/user.entity';

@Module({
  imports: [DatabaseOrmConfigModule, TypeOrmModule.forFeature([User])],
  providers: [StripeService, User],
  exports: [StripeService],
})
export class StripeServiceModule {}
