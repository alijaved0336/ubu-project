import { BlogUsecase } from '@use-cases/blog.usecase';
import { PaginationQueryDto } from './pagination.dto';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { CreateBlogDto, FindBlogDTO, UpdateBlogDto } from './create-blog.dto';

import {
  Controller,
  Request,
  Get,
  UseGuards,
  ClassSerializerInterceptor,
  Inject,
  UseInterceptors,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UploadedFiles
} from '@nestjs/common';
import UsecaseProxy, { BLOG_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeInterceptor } from '../UploadFiles/max-file-size.validator';
@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(JwtAuthGuard)
@Controller('blog')
@ApiTags('Blogs')
// @ApiBearerAuth()
export class BlogsController {
  constructor(
    @Inject(BLOG_USECASE_PROXY)
    private readonly blogsUsecaseProxy: UsecaseProxy<BlogUsecase>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Blog' })
  @ApiResponse({ status: 201, description: 'Blog created successfully.' })
  @UseInterceptors(FilesInterceptor('files', 1), new FileSizeInterceptor(20 * 1024 * 1024))
  customCreate(@Request() req: any, @UploadedFiles() files, @Body() createBlogDto: CreateBlogDto): Promise<any> {
    const userId = req.user.id;
    console.log(createBlogDto, 'createBlogDto');
    return this.blogsUsecaseProxy.getInstance().customCreate(createBlogDto, userId, files);
  }

  @Put('update_cover_photo/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the cover photo' })
  @UseInterceptors(FilesInterceptor('files', 1), new FileSizeInterceptor(20 * 1024 * 1024))
  updateCoverPhoto(@Request() req: any, @UploadedFiles() files, @Param('id') id: string): Promise<any> {
    return this.blogsUsecaseProxy.getInstance().updateCoverPhoto(req.user.id, +id, files);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all User Blogs' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved blogs.' })
  async customFindAll(@Query() paginationQueryDto: PaginationQueryDto): Promise<any> {
    const { page, limit, search, tags } = paginationQueryDto;

    return this.blogsUsecaseProxy.getInstance().customFindAll(page, limit, search, tags);
  }

  @Get('/public')
  @ApiOperation({ summary: 'Retrieve all Blogs' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved blogs.' })
  async publicFindAll(@Query() paginationQueryDto: PaginationQueryDto): Promise<any> {
    const { page, limit, search, tags } = paginationQueryDto;
    return this.blogsUsecaseProxy.getInstance().publicFindAll(page, limit, search, tags);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific blog by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the blog.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  findOne(@Param() params: FindBlogDTO): Promise<any> {
    return this.blogsUsecaseProxy.getInstance().findOne({ id: +params.id }, ['user', 'blogTags', 'blogTags.tag']);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific Blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  @UseInterceptors(FilesInterceptor('files', 1), new FileSizeInterceptor(20 * 1024 * 1024))
  customUpdate(@Request() req: any, @Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto, @UploadedFiles() files): Promise<any> {
    const userId = req.user.id;
    return this.blogsUsecaseProxy.getInstance().customUpdate(+id, updateBlogDto, userId, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  customRemove(@Param('id') id: string) {
    return this.blogsUsecaseProxy.getInstance().customRemove(+id);
  }
}
