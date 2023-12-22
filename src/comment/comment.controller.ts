import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './comment.dto';
import { Comment } from './comment.model';
import { ApiResponse } from 'src/interfaces/api-response';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() commentDto: CommentDto): Promise<ApiResponse<Comment>> {
    return this.commentService.create(commentDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() commentDto: CommentDto): Promise<ApiResponse<Comment>> {
    return this.commentService.update(id, commentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<Comment>
  > {
    return this.commentService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Comment>> {
    return this.commentService.findOne(id);
  }

  @Get('post/:postId')
  async findAllByPost(@Param('postId') postId: string): Promise<ApiResponse<Comment[]>> {
    return this.commentService.getPostComments(postId);
  }
  
  @Get()
  async findAll(): Promise<ApiResponse<Comment[]>> {
    return this.commentService.findAll();
  }
}
