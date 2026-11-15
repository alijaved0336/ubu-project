import { Module, OnModuleInit } from '@nestjs/common'
import { SeedCommandService } from './seeder.command'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { InfrastructureUsecasesBridgeModule } from 'infrastructure-usecases-bridge/infrastructure-usecases-bridge.module'
import { CommandModule } from 'nestjs-command'
import { RepositoriesModule } from '@infrastructure/orm/reposiories/repository.module'

@Module({
  imports: [CommandModule, RepositoriesModule],
  providers: [SeedCommandService],
  exports: [SeedCommandService]
})
export class SeederModule { }
