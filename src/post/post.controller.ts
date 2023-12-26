import { Posts } from './post.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  async create(@Body() postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    return this.postService.create(postDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    return this.postService.update(id, postDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<Posts>> {
    return this.postService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Posts>> {
    return this.postService.findOne(id);
  }

  @Get()
  async findAll(): Promise<ApiResponse<Posts[]>> {
    return this.postService.findAll();
  }
}
