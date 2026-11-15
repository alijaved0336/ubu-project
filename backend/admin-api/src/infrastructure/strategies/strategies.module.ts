import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module';
import { GoogleStrategy } from './google.strategy';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt-service.module';

@Module({
  imports: [InfrastructureUsecasesBridgeModule.register(), JwtServiceModule],
  providers: [JwtStrategy, GoogleStrategy],
  exports: [JwtStrategy, GoogleStrategy],
})
export class StrategyModule {}
