import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { AUTH_USECASE_PROXY, SEARCH_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchUsecase } from '@use-cases/search.usecase';
import { PageDTO, SearchDTO } from './search.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('searches')
@ApiBearerAuth()
@Controller('searches')
export class SearchController {
  constructor(
    @Inject(SEARCH_USECASE_PROXY)
    private readonly searchUsecaseProxy: UsecaseProxy<SearchUsecase>
  ) { }

  @Get('/product')
  @ApiOperation({ summary: 'Search for products based on a search string' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'searchString', required: true, description: 'The search string to look up products' })
  @ApiQuery({ name: 'page', required: false, description: 'The page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'The number of items per page for pagination', example: 10 })
  async getProducts(
    @Query() query: SearchDTO,
    @Req() request
  ) {
    return this.searchUsecaseProxy.getInstance().searchAllProducts(
      request.user,
      query.searchString,
      query.page,
      query.limit
    );
  }

  @Get('/')
  @ApiOperation({ summary: 'User Searches' })
  @ApiResponse({ status: 200, description: 'User Searches retrivesuccessfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, description: 'The page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'The number of items per page for pagination', example: 10 })
  async getUserSearches(
    @Query() query: PageDTO,
    @Req() request
  ) {
    return this.searchUsecaseProxy.getInstance().getUserSearches(
      request.user,
      query.page,
      query.limit
    );
  }


  @Delete('/:search_id')
  @ApiOperation({ summary: 'Delete a search entry by search ID' })
  @ApiResponse({ status: 200, description: 'Search entry deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Search entry not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'search_id', required: true, description: 'The ID of the search to delete', example: '12345' })
  async deleteSearch(
    @Param('search_id') searchId: string, // Accept as string
    @Req() request
  ): Promise<{ message: string }> {
    const userId = request.user.id;
    const searchIdNumber = Number(searchId);
    if (isNaN(searchIdNumber))
    {
      throw new BadRequestException(`Invalid search ID: ${searchId}`);
    }
    const result = await this.searchUsecaseProxy.getInstance().deleteSearchById(searchIdNumber);
    if (!result)
    {
      throw new NotFoundException(`Search entry with ID ${searchId} not found.`);
    }
    return { message: `Search entry with ID ${searchIdNumber} deleted successfully.` };
  }

}
