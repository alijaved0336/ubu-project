import { IUser } from './user.interface';

export interface ISocialIntegration {
  id: number;
  user: IUser;
  social_platform_name: string;
  access_token: string;
  token_last_updated: Date;
  social_user_id: string;
}
