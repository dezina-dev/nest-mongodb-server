import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './comment.dto';
import { Comment } from './comment.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() commentDto: CommentDto): Promise<ApiResponse<Comment>> {
    return this.commentService.create(commentDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() commentDto: CommentDto): Promise<ApiResponse<Comment>> {
    return this.commentService.update(id, commentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<ApiResponse<Comment>
  > {
    return this.commentService.delete(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string): Promise<ApiResponse<Comment>> {
    return this.commentService.findOne(id);
  }

  @Get('post/:postId')
  @UseGuards(AuthGuard)
  async findAllByPost(@Param('postId') postId: string): Promise<ApiResponse<Comment[]>> {
    return this.commentService.getPostComments(postId);
  }
  
  @Get()
  async findAll(): Promise<ApiResponse<Comment[]>> {
    return this.commentService.findAll();
  }
}
