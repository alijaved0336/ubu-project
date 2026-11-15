import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ClassSerializerInterceptor,
  Inject,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { PostsUsecase } from '@use-cases/posts.usecase';
import UsecaseProxy, { POST_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CreatePostDto, UpdatePostDto } from './create-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('posts')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostsController {
  constructor(
    @Inject(POST_USECASE_PROXY)
    private readonly postsUsecaseProxy: UsecaseProxy<PostsUsecase>,
  ) {}

  @Get('/product/get_products')
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products.' })
  getProducts(@Request() req: any) {
    const userId = req.user.id;
    return this.postsUsecaseProxy.getInstance().getProducts(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  @UseInterceptors(
    FilesInterceptor('files', 5),
    new FileSizeInterceptor(30 * 1024 * 1024), // 30MB in bytes
  )
  create(@Request() req: any, @UploadedFiles() files, @Body() createPostDto: CreatePostDto): Promise<any> {
    const userId = req.user.id;
    return this.postsUsecaseProxy.getInstance().create(createPostDto, userId, files);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all posts' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved posts.' })
  findAll(@Request() req: any, @Query('page') page: string, @Query('limit') limit: string, @Query('search') search?: string, @Query('status') status?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 4;
    return this.postsUsecaseProxy.getInstance().findAllWithPagination(req.user.id, pageNumber, limitNumber, search, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific post by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string): Promise<any> {
    return this.postsUsecaseProxy.getInstance().findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific post by ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @UseInterceptors(FilesInterceptor('files', 5), new FileSizeInterceptor(30 * 1024 * 1024))
  update(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFiles() files,
    @Body() updatePostDto: UpdatePostDto,
    @Query('requestFrom') requestFrom?: string,
  ): Promise<any> {
    const userId = req.user.id;
    const reqFrom = requestFrom ?? 'iosApplication';
    return this.postsUsecaseProxy.getInstance().update(+id, updatePostDto, userId, files, reqFrom);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific post by ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  remove(@Param('id') id: string) {
    return this.postsUsecaseProxy.getInstance().remove(+id);
  }
}
