import { Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document, ObjectId } from 'mongoose';
import { Posts } from './post.model';
import { Comment } from 'src/comment/comment.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { ServiceExceptionFilter } from 'src/exception-filters/exception-filter';

@UseFilters(new ServiceExceptionFilter())
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Posts.name) private readonly postModel: Model<Posts>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) { }

  async create(postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    try {
      const createdPost = new this.postModel(postDto);
      const savedPost = await createdPost.save();
      return { success: true, message: 'Post created successfully', data: savedPost };
    }
    catch (error) {
      return { success: false, message: 'Failed to create post', data: null };
    }
  }

  async update(id: string, postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    try {
      const updatedPost = await this.postModel
        .findByIdAndUpdate(id, postDto, { new: true })
        .exec();
      if (!updatedPost) {
        throw new NotFoundException('Post not found');
      }
      return { success: true, message: 'Post updated successfully', data: updatedPost };
    } catch (error) {
      return { success: false, message: 'Failed to update post', data: null };
    }
  }

  async delete(id: string): Promise<ApiResponse<Posts | null>> {
    try {
      const deletedPost = await this.postModel.findByIdAndDelete(id).lean().exec();
      if (!deletedPost) {
        throw new NotFoundException('Post not found');
      }
      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete post', data: null };
    }
  }

  async findAll(): Promise<ApiResponse<Posts[]>> {
    try {
      const posts = await this.postModel.find().populate('user').exec();
      return { success: true, data: posts };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve posts', data: null };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Posts>> {
    try {
      const post = await this.postModel.findById(id).exec();
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const comments = await this.commentModel.find({ post: new Types.ObjectId(id) }).populate('commentBy', 'username').exec();

      const postWithComments: any = { ...post.toObject(), comments };

      return { success: true, data: postWithComments };

    } catch (error) {
      return { success: false, message: 'Failed to retrieve post with comments', data: null };
    }
  }

}