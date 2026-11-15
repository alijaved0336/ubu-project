import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import * as Sentry from '@sentry/nestjs';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Request, // Import Sse decorator
  UseGuards,
  UseInterceptors,
  Query,
  Body,
  HttpException,
  Patch,
  Post,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  Req,
  Put,
} from '@nestjs/common';
import { Server } from 'socket.io';
import UsecaseProxy, { AUTH_USECASE_PROXY, INFLUENCER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { InfluencerUsecase } from '@use-cases/influencer.usecase';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { AuthUsecase } from '@use-cases/auth.usecase';
import { CreateScanDto, MarkAsPotentialDTO, UpdateInfluencerProfileDto, UpdateMeasurementDto } from './influencer.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('influencer')
@ApiTags('Influencers')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class InfluencerController {
  server: Server;
  constructor(
    @Inject(INFLUENCER_USECASE_PROXY)
    private readonly influencerUsecaseProxy: UsecaseProxy<InfluencerUsecase>,
    private readonly webSocketProvider: WebSocketProviderService,
    @Inject(AUTH_USECASE_PROXY)
    private readonly authUsecaseProxy: UsecaseProxy<AuthUsecase>,
  ) {}

  onModuleInit() {
    this.server = this.webSocketProvider.getServerInstance();
  }

  private async registerSocketEvents(event: string, data: any, receiver: number) {
    if (!this.server) {
      console.error('Server instance not initialized');
      return;
    }

    try {
      this.server.to(`${receiver}`).emit(event, data);
    } catch (error) {
      console.error('Error emitting socket event:', error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get the current influencer data' })
  @ApiResponse({ status: 200, description: 'The current influencer data' })
  @Get('')
  async getConsumer(@Req() request) {
    return this.influencerUsecaseProxy.getInstance().getById(request.user?.influencer?.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('generate_body_scan_token')
  generateBodyMeasurmentToken(@Request() req: any) {
    return this.influencerUsecaseProxy.getInstance().generateBodyMeasurmentToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('is_authenticated_influencer')
  isAUthenticatedInfluncerforScan(@Request() req: any) {
    return this.influencerUsecaseProxy.getInstance().isAuthenticatedInfluncerforScan(req.user);
  }

  @Get('label/:label_id')
  async saveMeasurments(@Param('label_id') label_id: string, @Query('scan_id') scan_id: string, @Query('access_token') token: string) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= decodedToken.exp) {
      console.error('Token has expired.');
      throw new UnauthorizedException('TokenExpiredException');
    }
    const influencer = await this.influencerUsecaseProxy.getInstance().findOneByEmail(decodedToken?.email);
    if (!influencer) {
      throw new NotFoundException("User doesn't exsists");
    }
    const influencerId = influencer.id;

    if (scan_id) {
      try {
        const isSaveMeasurement = await this.influencerUsecaseProxy.getInstance().saveMeasurments(scan_id, influencer);
        if (isSaveMeasurement) {
          this.registerSocketEvents('handleQrScanSuccess', true, influencer?.user?.id);
        }
        const refreshToken = await this.authUsecaseProxy.getInstance().generateRefreshToken(decodedToken?.email);
        return {
          message: 'success',
          description: `Scan ID: ${scan_id} saved for influencer: ${influencerId}`,
          refreshToken,
        };
      } catch (error) {
        this.registerSocketEvents('handleQrScanFailed', 'There was an issue while scanning, please scan again.', influencer?.user?.id);
        console.error(
          `Cannot store body measurements against scan ID ${scan_id}. Error: ${error?.data?.error?.message}, Status: ${error?.status + ' ' + error?.statusText}`,
        );
        const e = new HttpException(
          {
            message: 'There was an issue while scanning, please scan again.',
            description: `Cannot store body measurements against scan ID ${scan_id}. Error: ${error?.data?.error?.message}, Status: ${error?.status + ' ' + error?.statusText}`,
          },
          error?.status,
        );
        Sentry.captureException(e);
        throw e;
      }
    } else {
      console.error('Scan Id not found.');
      this.registerSocketEvents('handleQrScanFailed', 'There was an issue while scanning, please scan again', influencer?.user?.id);
      const error = new HttpException(
        {
          message: 'There was an issue while scanning, please scan again.',
          description: 'Scan Id not found.',
        },
        HttpStatus.NOT_FOUND,
      );
      Sentry.captureException(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  findInfluencerInfo(@Request() req: any) {
    const influencerId = req.user.influencer?.id;
    if (!influencerId) {
      throw new HttpException('Influencer not found', 404);
    }
    return this.influencerUsecaseProxy.getInstance().findOne(influencerId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/profile_info')
  InfluencerProfileInfo(@Request() req: any) {
    const influencerId = req.user.influencer?.id;
    if (!influencerId) {
      throw new HttpException('Influencer not found', 404);
    }
    return this.influencerUsecaseProxy.getInstance().influencerProfile(influencerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-modal-status')
  updateInfluencerModal(@Request() req: any) {
    const influencerId = req.user.influencer?.id;
    if (!influencerId) {
      throw new HttpException('Influencer not found', 404);
    }
    return this.influencerUsecaseProxy.getInstance().updateInfluencerModalStatus(influencerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.influencerUsecaseProxy.getInstance().findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/by_user_id/:id')
  findByUserId(@Request() req: any, @Param('id') id: number) {
    const userId = req.user.id;
    return this.influencerUsecaseProxy.getInstance().findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(`/mark_potential`)
  markPotential(@Request() req: any, @Body() params: MarkAsPotentialDTO) {
    const userId = req.user.id;
    return this.influencerUsecaseProxy.getInstance().markPotential(userId, params);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Influencer Profile Updation' })
  @ApiResponse({ status: 200, description: 'The influencer has been updated' })
  @Put('update_influencer_profile')
  async updateInfluencerProfile(@Req() request, @Body() updateInfluencerDto: UpdateInfluencerProfileDto) {
    return this.influencerUsecaseProxy.getInstance().updateInfluencerProfile(request.user, updateInfluencerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get_measurements/bodygram')
  fetchInfluencerMeasurements(@Request() req: any) {
    return this.influencerUsecaseProxy.getInstance().fetchInfluencerMeasurements(req?.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update_measurements')
  updateInfluencerMeasurements(@Request() req: any, @Body() updateMeasurementDto: UpdateMeasurementDto) {
    return this.influencerUsecaseProxy.getInstance().updateInfluencerMeasurements(req?.user?.id, updateMeasurementDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/manual_bm')
  async saveMeasurmentsManually(@Body() createScanDto: CreateScanDto, @Req() request) {
    console.log('req--', request.user);
    return this.influencerUsecaseProxy.getInstance().ManualInfluencerMeasurement(createScanDto, request.user);
  }
}
