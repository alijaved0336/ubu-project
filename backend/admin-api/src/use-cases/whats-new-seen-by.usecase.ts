import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { WhatsNewSeenByRepository } from '@infrastructure/orm/reposiories/whats-new-seen-by.repository';
import { WhatsNewRepository } from '@infrastructure/orm/reposiories/whats-new.repository';
import { CreateWhatsNewSeenByDto } from '@infrastructure/presentation/whats-new-seen-by/whats-new-seen-by.dto';
import { NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';

export class WhatsNewSeenByUsecase {
  constructor(
    private whatsNewSeenByRepository: WhatsNewSeenByRepository,
    private whatsNewRepository: WhatsNewRepository,
    private userRepository: UserRepository,
  ) {}

  async create(whatsNewSeenByDto: CreateWhatsNewSeenByDto, userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const whatsNewArray = await this.whatsNewRepository.findBy({ id: In(whatsNewSeenByDto.whatsNewIds) });

    const whatsNewUserPairs = whatsNewArray.map((whatsNew) => ({
      whatsNew,
      user,
    }));

    await this.whatsNewSeenByRepository.createMultiple(whatsNewUserPairs);
  }
}
