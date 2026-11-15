import { SessionLogRepository } from '@infrastructure/orm/reposiories/sessionlog.repository';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { SessionLogUseCase } from '@use-cases/sessionlog.usecase';
import UsecaseProxy, { SESSION_LOG_ENTRY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function SessionLogProvider() {
  return {
    inject: [SessionLogRepository, BcryptService],
    provide: SESSION_LOG_ENTRY,
    useFactory: (sessionLogRepo: SessionLogRepository, bcryptService: BcryptService) => new UsecaseProxy(new SessionLogUseCase(sessionLogRepo, bcryptService)),
  };
}
