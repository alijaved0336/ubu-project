import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
  RequestFor,
  RequestStatus,
} from '@infrastructure/orm/entities/user-requests.entity';
import { RelationType } from '@infrastructure/orm/entities/profile.entity';

export class SendUserRequestDto {
  @ApiProperty({ example: 2, description: 'ID of the requestee user' })
  @IsNumber()
  @IsNotEmpty()
  requesteeId: number;

  @ApiProperty({
    enum: RelationType,
    description: 'Type of relationship being requested',
  })
  @IsEnum(RelationType)
  relationType: RelationType;

  @ApiProperty({
    enum: RequestFor,
    description: 'Type of Request For being requested',
  })
  @IsEnum(RequestFor)
  requestFor: RequestFor;
}

export class RespondToRequestDto {
  @ApiProperty({ example: 1, description: 'ID of the request to respond to' })
  @IsNumber()
  @IsNotEmpty()
  requestId: number;

  @ApiProperty({ enum: ['accept', 'reject'], description: 'Action to take' })
  @IsEnum(['accept', 'reject'], {
    message: 'Action must be either "accept" or "reject"',
  })
  action: 'accept' | 'reject';
}

export class CancelRequestDto {
  @ApiProperty({ example: 2, description: 'ID of the requestee user' })
  @IsNumber()
  @IsNotEmpty()
  requesteeId: number;

  @ApiProperty({
    enum: RelationType,
    description: 'Type of relationship to cancel',
  })
  @IsEnum(RelationType)
  relationType: RelationType;
}

export class UserRequestResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  requesterId: number;

  @ApiProperty({ example: 2 })
  requesteeId: number;

  @ApiProperty({ enum: RelationType })
  relationType: RelationType;

  @ApiProperty({ enum: RequestStatus })
  status: RequestStatus;

  @ApiProperty({ example: '2025-07-16T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-16T00:00:00.000Z' })
  updatedAt: Date;
}
