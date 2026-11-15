import { CombinedUserProfileDto } from '@infrastructure/presentation/profile/profile.dto';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DependantDefaultsPipe implements PipeTransform {
  transform(value: CombinedUserProfileDto) {
    if (value.user.isDependant) {
      const timestamp = Date.now();
      value.user.email = value.user.email || `dependant-${timestamp}@dummy.com`;
      value.user.password = value.user.password || `P@ss-${timestamp}`;
    }
    return value;
  }
}
