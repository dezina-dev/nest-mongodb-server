import { Posts } from './post.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    return this.postService.create(postDto);
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
}
