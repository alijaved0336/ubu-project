import {
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { CombinedUserProfileDto } from '@infrastructure/presentation/profile/profile.dto';

@Injectable()
export class DependantDefaultsPipe implements PipeTransform {
  transform(value: CombinedUserProfileDto): CombinedUserProfileDto {
    const { user, profile } = value;

    if (profile?.isDependant) {
      // If dependant, enforce that email and password are empty
      if (user.email || user.password) {
        throw new BadRequestException('Email and Password must be empty for dependants.');
      }

      const timestamp = Date.now();
      user.email = `dependant-${timestamp}@dummy.com`;
      user.password = `P@ss-${timestamp}`;
    } else {
      // Validate manually only if not dependant
      if (!user.email || typeof user.email !== 'string') {
        throw new BadRequestException('Email is required and must be a string.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        throw new BadRequestException('Invalid email format.');
      }

      if (!user.password || typeof user.password !== 'string') {
        throw new BadRequestException('Password is required and must be a string.');
      }
      if (user.password.length < 8 || user.password.length > 20) {
        throw new BadRequestException('Password must be between 8 and 20 characters.');
      }
    }

    return value;
  }
}
