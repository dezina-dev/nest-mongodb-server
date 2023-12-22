import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.model';
import { CommentDto } from './comment.dto';
import { ApiResponse } from 'src/interfaces/api-response';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>
  ) { }

  async create(commentDto: CommentDto): Promise<ApiResponse<Comment>> {
    try {
      const createdComment = new this.commentModel(commentDto);
      const savedComment = await createdComment.save();

      return { success: true, message: 'Comment created successfully', data: savedComment };
    } catch (error) {
      return { success: false, message: 'Failed to create comment', data: null };
    }
  }

  async findAll(): Promise<ApiResponse<Comment[]>> {
    try {
      const comments = await this.commentModel
        .find()
        .populate('user', 'username')
        .populate('post', 'title content')
        .exec();

      if (!comments) {
        throw new NotFoundException('Comments not found');
      }

      return { success: true, message: '', data: comments };
    } catch (error) {
      console.log('error', error);
      return { success: false, message: 'Failed to retrieve comments', data: null };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Comment>> {
    try {
      const comment = await this.commentModel.findById(id)
        .populate('commentBy', 'username')
        .populate('post', 'title content')
        .exec();

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      return { success: true, message: '', data: comment };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve comment', data: null };
    }
  }

  async update(id: string, commentDto: CommentDto): Promise<ApiResponse<Comment>> {
    try {
      const updatedComment = await this.commentModel
        .findByIdAndUpdate(id, commentDto, { new: true })
        .exec();

      if (!updatedComment) {
        throw new NotFoundException('Comment not found');
      }

      return { success: true, message: 'Comment updated successfully', data: updatedComment };
    } catch (error) {
      return { success: false, message: 'Failed to update comment', data: null };
    }
  }

  async delete(id: string): Promise<ApiResponse<Comment | null>> {
    try {
      const deletedComment = await this.commentModel.findByIdAndDelete(id).lean().exec();

      if (!deletedComment) {
        throw new NotFoundException('Comment not found');
      }

      return { success: true, message: 'Comment deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete comment', data: null };
    }
  }

  async getPostComments(postId: string): Promise<ApiResponse<Comment[]>> {
    try {
      const allPostComments = await this.commentModel
        .find({ post: new Types.ObjectId(postId) })
        .populate('commentBy', 'username')
        .select('-post') // Exclude the 'post' field
        .exec();

      const getPost = await this.commentModel
        .find({ post: new Types.ObjectId(postId) })
        .populate({
          path: 'post',
          populate: {
            path: 'user',
            select: 'username', // Include the fields you want for the user data
          },
        })
        .limit(1)
        .exec();

      if (!allPostComments) {
        throw new NotFoundException('No comments found for the specified post');
      }
      return { success: true, message: '', data: allPostComments, post: getPost[0]?.post };
    } catch (error) {
      throw new NotFoundException('No comments found for the specified post');
    }
  }

}