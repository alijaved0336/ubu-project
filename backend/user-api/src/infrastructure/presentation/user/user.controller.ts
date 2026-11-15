import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsecaseProxy, {
  USER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  deleteResponseDto,
  SearchUsersDto,
  UpdateUserDto,
  UpdateUserDto_new,
} from './user.dto';
import { UserUsecase } from '@use-cases/user.usecase';
import { Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_USECASE_PROXY)
    private readonly userUsecaseProxy: UsecaseProxy<UserUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Updater data' })
  @ApiResponse({ status: 200, description: 'The current user data' })
  @Patch('new_update')
  async updateUserNew(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    return this.userUsecaseProxy
      .getInstance()
      .updateByIdNew(request.user, updateUserDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete user',
    description:
      'Deletes the user and their associated data based on their role (brand or influencer).',
  })
  @ApiResponse({
    status: 200,
    description: 'User and related data deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input or dependencies.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteUser(
    @Req() req: any,
    @Param('isSoftDelete', ParseBoolPipe) isSoftDelete: boolean = false,
  ): Promise<deleteResponseDto> {
    const user = req.user;

    // Ensure user is authenticated and has a valid role
    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    return await this.userUsecaseProxy
      .getInstance()
      .deleteOrRevertUser(user, isSoftDelete, false);
  }

  @Get('/testing-automated-deployment')
  @ApiOperation({ summary: 'Endpoint to test automated deployment' })
  async testingAutomatedDeployment() {
    return { msg: 'Automated Deployment Successful 🔥🔥' };
  }

  @Get('/switch-user/:id/:role')
  @ApiOperation({
    summary: 'Switch user',
    description:
      'Switch the user by id and their associated data based on their role (shopper or influencer).',
  })
  @ApiResponse({
    status: 200,
    description: 'User and related data fetched successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input or dependencies.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async switchUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('role') role: 'shopper' | 'influencer',
  ) {
    return this.userUsecaseProxy.getInstance().switchUser(id, role);
  }

  @Post('/search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search users by name or email' })
  @ApiBody({
    type: SearchUsersDto,
    description: 'Search string, page, and limit',
  })
  @ApiResponse({ status: 200, description: 'Users found successfully' })
  async searchUsersPost(@Body() body: SearchUsersDto, @Req() req: any) {
    const { searchString, page, limit } = body;
    const { id } = req.user;
    return this.userUsecaseProxy
      .getInstance()
      .searchUsers(searchString, page, limit, id);
  }
}
