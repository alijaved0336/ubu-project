import {
  Controller,
  Post,
  Delete,
  Get,
  Put,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import UsecaseProxy, {
  USER_REQUESTS_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { UserRequestsUsecase } from '@use-cases/user-requests.usecase';
import {
  CancelRequestDto,
  SendUserRequestDto,
  RespondToRequestDto,
  UserRequestResponseDto,
} from './user-requests.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-requests')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserRequestsController {
  constructor(
    @Inject(USER_REQUESTS_USECASE_PROXY)
    private readonly userRequestsUsecaseProxy: UsecaseProxy<UserRequestsUsecase>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a user relationship request' })
  @ApiBody({ type: SendUserRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Request sent successfully',
    type: UserRequestResponseDto,
  })
  async sendRequest(@Body() body: SendUserRequestDto, @Request() req: any) {
    const requesterId = req.user.id;
    const request = await this.userRequestsUsecaseProxy
      .getInstance()
      .sendRequest(
        requesterId,
        body.requesteeId,
        body.relationType,
        body.requestFor,
      );

    return {
      message: 'Request sent successfully',
      request,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a previously sent request' })
  @ApiBody({ type: CancelRequestDto })
  @ApiResponse({ status: 200, description: 'Request cancelled successfully' })
  async cancelRequest(@Body() body: CancelRequestDto, @Request() req: any) {
    const requesterId = req.user.id;
    await this.userRequestsUsecaseProxy
      .getInstance()
      .cancelRequest(requesterId, body.requesteeId, body.relationType);

    return { message: 'Request cancelled successfully' };
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending requests for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of pending requests',
    type: [UserRequestResponseDto],
  })
  async getPendingRequests(@Request() req: any) {
    const userId = req.user.id;
    const requests = await this.userRequestsUsecaseProxy
      .getInstance()
      .getPendingRequestsForUser(userId);

    return { requests };
  }

  @Put('respond')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Respond to a request (accept or reject)' })
  @ApiBody({ type: RespondToRequestDto })
  @ApiResponse({ status: 200, description: 'Request response submitted' })
  async respondToRequest(@Body() body: RespondToRequestDto) {
    await this.userRequestsUsecaseProxy
      .getInstance()
      .respondToRequest(body.requestId, body.action);

    return { message: `Request ${body.action}ed successfully` };
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get all requests sent by the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of sent requests',
    type: [UserRequestResponseDto],
  })
  async getSentRequests(@Request() req: any) {
    const userId = req.user.id;
    const requests = await this.userRequestsUsecaseProxy
      .getInstance()
      .getRequestsByRequesterId(userId);

    return { requests };
  }

  @Get('received')
  @ApiOperation({
    summary: 'Get all requests received by the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of received requests',
    type: [UserRequestResponseDto],
  })
  async getReceivedRequests(@Request() req: any) {
    const userId = req.user.id;
    const requests = await this.userRequestsUsecaseProxy
      .getInstance()
      .getRequestsByRequesteeId(userId);

    return { requests };
  }
}
