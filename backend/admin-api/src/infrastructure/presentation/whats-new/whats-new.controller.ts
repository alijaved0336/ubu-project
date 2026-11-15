import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ClassSerializerInterceptor,
  Inject,
  UseInterceptors,
  Query,
  Delete,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import UsecaseProxy, { WHATS_NEW_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { WhatsNewUsecase } from '@use-cases/whats-new.usecase';
import { CreateWhatsNewDto, UpdateWhatsNewDto } from './whats-new.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('whats_new')
@ApiTags('WhatsNew')
@ApiBearerAuth()
export class WhatsNewController {
  constructor(
    @Inject(WHATS_NEW_USECASE_PROXY)
    private readonly whatsNewUsecaseProxy: UsecaseProxy<WhatsNewUsecase>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new whats new' })
  @ApiResponse({ status: 201, description: 'Whats new created successfully.' })
  create(@Request() req: any, @Body() createWhatsNewDto: CreateWhatsNewDto): Promise<any> {
    return this.whatsNewUsecaseProxy.getInstance().create({ ...createWhatsNewDto, user: { id: req.user.id } });
  }

  @Get('find_all_by_user')
  @ApiOperation({ summary: 'Retrieve all whats new by user id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved whats new.',
  })
  findAllByUserIdWithPagination(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 4;
    return this.whatsNewUsecaseProxy.getInstance().findAllByUserIdWithPagination(req.user.id, pageNumber, limitNumber, search);
  }

  @Get('find_all')
  @ApiOperation({ summary: 'Retrieve all whats new by user id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved whats new.',
  })
  findAllWithPagination(@Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 4;
    return this.whatsNewUsecaseProxy.getInstance().findAllWithPagination(pageNumber, limitNumber, search);
  }

  @Get('get_all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all whats new by user id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved whats new.',
  })
  getAll(@Request() req: any) {
    const userId = req.user.id;
    return this.whatsNewUsecaseProxy.getInstance().customFindAndCount(+userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific whats new by ID' })
  @ApiResponse({ status: 200, description: 'Whats new updated successfully.' })
  @ApiResponse({ status: 404, description: 'Whats new not found.' })
  update(@Param('id') id: string, @Body() updateWhatsNewDto: UpdateWhatsNewDto): Promise<any> {
    return this.whatsNewUsecaseProxy.getInstance().update({ id: +id }, updateWhatsNewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific Whats New by ID' })
  @ApiResponse({ status: 200, description: 'Whats New deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Whats New not found.' })
  remove(@Param('id') id: string) {
    return this.whatsNewUsecaseProxy.getInstance().remove(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific whats new by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the whats new.',
  })
  @ApiResponse({ status: 404, description: 'Whats New not found.' })
  findOne(@Param('id') id: string): Promise<any> {
    return this.whatsNewUsecaseProxy.getInstance().findOne({ id: +id });
  }
}
