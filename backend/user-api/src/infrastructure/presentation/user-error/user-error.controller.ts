import { CreateUserErrorDto } from "./user-error.dto";
import { UserErrorUsecase } from "@use-cases/user-error.usecase";
import { JwtAuthGuard } from "@infrastructure/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import UsecaseProxy, { USER_ERROR_USECASE_PROXY } from "infrastructure-usecases-bridge/usecase-proxy";
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Query, Request, UseGuards, UseInterceptors } from "@nestjs/common";

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

  @Post()
  @ApiOperation({ summary: 'Create a new user error new' })
  @ApiResponse({ status: 201, description: 'User error created successfully.' })
  create(@Request() req: any, @Body() createUserErrorDto: CreateUserErrorDto): Promise<any> {
    return this.userErrorUsecaseProxy.getInstance().create({ message: createUserErrorDto.error, user: { id: req.user.id } });
  }
}
