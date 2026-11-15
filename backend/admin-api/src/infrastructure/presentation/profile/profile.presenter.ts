import { Injectable } from '@nestjs/common';

import {
  ProfileDetailDto,
  ProfileSummaryDto,
  UserSummaryDto,
  ProfileStatsDto,
  ApiResponseDto,
  PaginatedResponseDto,
  ErrorResponseDto,
  ProfileFinalDetailDto,
} from './profile.dto';
import { Profile } from '@infrastructure/orm/entities/profile.entity';
import { User } from '@infrastructure/orm/entities/user.entity';

@Injectable()
export class ProfilePresenter {
  presentProfileDetail(profile: Profile): ProfileDetailDto {
    return {
      profile: {
        id: profile.id,
        relation: profile.relation,
        is_active: profile.is_active,
        parent_user_id: profile.parent_user_id,
        child_user_id: profile.child_user_id || undefined,
        created_at: this.formatDateTime(profile.created_at!),
        updated_at: this.formatDateTime(profile.updated_at!),
        child_user: profile.child_user ? this.presentUserSummary(profile.child_user) : undefined,
        has_child_user: !!profile.child_user_id,
      },
      parent: {
        parent_user: profile.parent_user ? this.presentUserSummary(profile.parent_user) : undefined,
      },
    };
  }

  presentProfileSummary(profile: Profile): ProfileSummaryDto {
    return {
      id: profile.id,
      relation: profile.relation,
      is_active: profile.is_active,
      has_child_user: !!profile.child_user_id,
      created_at: this.formatDateTime(profile.created_at),
    };
  }

  presentUserSummary(user: User): UserSummaryDto {
    const fullName = this.buildFullName(user.first_name, user.last_name);

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name || undefined,
      last_name: user.last_name || undefined,
      full_name: fullName || undefined,
      avatar: user.influencer.avatar || user.consumer.avatar || user.brand.avatar || '',
    };
  }

  presentProfileStats(profiles: Profile[], maxProfilesAllowed: number = 5): ProfileStatsDto {
    const totalProfiles = profiles.length;
    const activeProfiles = profiles.filter((p) => p.is_active).length;
    const profilesWithChildUsers = profiles.filter((p) => p.child_user_id).length;
    const profilesWithoutChildUsers = profiles.filter((p) => !p.child_user_id).length;
    const remainingSlots = Math.max(0, maxProfilesAllowed - activeProfiles);

    return {
      total_profiles: totalProfiles,
      active_profiles: activeProfiles,
      profiles_with_child_users: profilesWithChildUsers,
      profiles_without_child_users: profilesWithoutChildUsers,
      max_profiles_allowed: maxProfilesAllowed,
      remaining_slots: remainingSlots,
    };
  }

  presentProfileSummaries(profiles: Profile[]): ProfileSummaryDto[] {
    return profiles.map((profile) => this.presentProfileSummary(profile));
  }

  presentProfileDetails(profiles: Profile[]): ProfileFinalDetailDto {
    const profilesLatest = profiles.map((profile) => this.presentProfileDetail(profile));

    return {
      profiles: profilesLatest.map((profile) => profile.profile),
      parent: profilesLatest[0].parent,
    };
  }
  x;

  presentSuccessResponse<T>(data: T, message: string = 'Operation completed successfully'): ApiResponseDto<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  presentPaginatedResponse<T>(data: T[], total: number, page: number, limit: number, message: string = 'Data retrieved successfully'): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: totalPages,
      },
      timestamp: new Date().toISOString(),
    };
  }

  presentErrorResponse(message: string, errorCode: string, validationErrors?: string[]): ErrorResponseDto {
    return {
      success: false,
      message,
      error_code: errorCode,
      validation_errors: validationErrors,
      timestamp: new Date().toISOString(),
    };
  }

  presentEmptySuccessResponse(message: string = 'Operation completed successfully'): ApiResponseDto<null> {
    return {
      success: true,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  filterProfiles(
    profiles: Profile[],
    filters: {
      activeOnly?: boolean;
      hasChildUser?: boolean;
    },
  ): Profile[] {
    let filteredProfiles = [...profiles];

    if (filters.hasChildUser !== undefined) {
      filteredProfiles = filteredProfiles.filter((p) => (filters.hasChildUser ? !!p.child_user_id : !p.child_user_id));
    }

    return filteredProfiles;
  }

  private formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  }

  private buildFullName(firstName?: string, lastName?: string): string | null {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : null;
  }
}

@Injectable()
export class ResponseBuilder {
  constructor(private readonly presenter: ProfilePresenter) {}

  success<T>(data: T, message?: string): ApiResponseDto<T> {
    return this.presenter.presentSuccessResponse(data, message);
  }

  empty(message?: string): ApiResponseDto<null> {
    return this.presenter.presentEmptySuccessResponse(message);
  }

  error(message: string, errorCode: string, validationErrors?: string[]): ErrorResponseDto {
    return this.presenter.presentErrorResponse(message, errorCode, validationErrors);
  }

  paginated<T>(data: T[], total: number, page: number, limit: number, message?: string): PaginatedResponseDto<T> {
    return this.presenter.presentPaginatedResponse(data, total, page, limit, message);
  }
}
