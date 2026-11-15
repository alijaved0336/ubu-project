import { PaginationDto } from '../common/common.dto';
import { UserErrorUsecase } from '@use-cases/user-error.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import UsecaseProxy, { USER_ERROR_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ClassSerializerInterceptor, Controller, Get, Inject, Query, UseGuards, UseInterceptors } from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('user_errors')
@ApiTags('User Error')
@ApiBearerAuth()
export class UserErrorController {
  constructor(
    @Inject(USER_ERROR_USECASE_PROXY)
    private readonly userErrorUsecaseProxy: UsecaseProxy<UserErrorUsecase>,
  ) {}

  @Get('find_all')
  @ApiOperation({ summary: 'Retrieve all errors' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user errors',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of errors per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering errors',
  })
  findAllWithPagination(@Query() query: PaginationDto) {
    return this.userErrorUsecaseProxy.getInstance().findAllWithPagination(query);
  }
}
