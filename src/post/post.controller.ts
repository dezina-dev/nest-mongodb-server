import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { Posts } from './post.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { PostService } from './post.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { PostDto } from './post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('image'))
  async create(@Body() postDto: PostDto, @UploadedFiles() files: Multer.File[]): Promise<ApiResponse<Posts>> {
    const image = files && files.length > 0 ? files[0] : undefined;
    return this.postService.create(postDto, image);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    return this.postService.update(id, postDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<ApiResponse<Posts>> {
    return this.postService.delete(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<ApiResponse<Posts>> {
    return this.postService.findOne(id);
  }

  @Get()
  // @UseGuards(AuthGuard) // Apply the AuthGuard to this route
  async findAll(): Promise<ApiResponse<Posts[]>> {
    return this.postService.findAll();
  }

  @Post('upload-image')
  @UseInterceptors(FilesInterceptor('image'))
  async uploadImage(@UploadedFiles() files: Multer.File[]): Promise<ApiResponse<Posts>> {
    const file = files[0];
    return this.postService.uploadImage(file);
  }
}
