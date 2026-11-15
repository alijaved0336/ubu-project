import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Inject, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import UsecaseProxy, { POST_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { PostUsecase } from '@use-cases/post.usecase';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostDto, RecentPostsPaginationDto } from './post.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(
    @Inject(POST_USECASE_PROXY)
    private readonly postUsecaseProxy: UsecaseProxy<PostUsecase>
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Reports of the post' })
  @ApiResponse({ status: 200, description: 'Report Posts' })
  @Get('/reports')
  async postReport() {
    return {
      status: 200,
      posts: []
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all posts by an influencer' })
  @ApiParam({ name: 'influencer_id', description: 'ID of the influencer', type: Number })
  @ApiResponse({ status: 200, description: 'List of influencer posts', type: [PostDto] })
  @Get('/influencer/:influencer_id')
  async getInfluencerPosts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Param('influencer_id', ParseIntPipe) influencer_id: number,
    @Req() request,
  ): Promise<{ posts: PostDto[], total: number }> {
    return this.postUsecaseProxy.getInstance().findAllInfluncersPosts(influencer_id, page, limit, request.user.consumer.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Record a visit to a post' })
  @ApiParam({ name: 'post_id', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'Post visit recorded successfully' })
  @Post('/:post_id/visit')
  async postVisit(
    @Param('post_id', ParseIntPipe) post_id: number,
    @Req() request,
  ) {
    const consumer_id = request.user?.consumer?.id
    return this.postUsecaseProxy.getInstance().postVisit(consumer_id, post_id);
  }

  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiResponse({ status: 200, description: 'List of all posts', type: [PostDto] })
  @Get('/all-posts')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Req() request,
  ) {
    return this.postUsecaseProxy.getInstance().findAll(page, limit, request.user.consumer.id);
  }

  @ApiOperation({ summary: 'Get home feed posts' })
  @ApiResponse({ status: 200, description: 'List of home feed posts', type: [PostDto] })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Optional search term for filtering home feed posts',
  })
  @ApiQuery({
    name: 'tab',
    required: false,
    enum: ['posts', 'influencers'],
    description: 'Tab type for search results (posts or influencers)',
  })
  @Get('/home-feed')
  async findHomeFeed(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Req() request,
    @Query('search') search?: string,
    @Query('tab') tab?: 'posts' | 'influencers',
  ) {
    return this.postUsecaseProxy.getInstance().findHomeFeed(request.user?.consumer?.id, page, limit, search?.trim() ? search : undefined, tab);
  }

  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'ID of the post', type: Number })
  @ApiResponse({ status: 200, description: 'The post data', type: PostDto })
  @Get('/post-by-id/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.postUsecaseProxy.getInstance().findById(id);
  }

  @Get('/recent_posts')
  @ApiOperation({ summary: 'Retrieve recent posts' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved recent posts.',
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
    description: 'Number of posts per page (default: 6)',
    example: 6,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering posts',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter posts by status',
  })
  findRecentPostsWithPagination(
    @Request() req: any,
    @Query() query: RecentPostsPaginationDto,
  ) {
    return this.postUsecaseProxy
      .getInstance()
      .findRecentPostsWithPagination(req.user.consumer.id, query);
  }
}
