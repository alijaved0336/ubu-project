import { Module } from '@nestjs/common'
import { BodyGramService } from './body-gram.service';
@Module({
  providers: [BodyGramService],
  exports: [BodyGramService]
})
export class BodyGramServiceModule {}
