import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts } from './post.model';
import { ApiResponse } from 'src/interfaces/api-response';

@Injectable()
export class PostService {
  constructor(@InjectModel(Posts.name) private readonly postModel: Model<Posts>) {}

  async create(postDto: Partial<Posts>): Promise<ApiResponse<Posts>> {
    try{
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
      return { success: true, message: '', data: posts };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve posts', data: null };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Posts>> {
    try {
      const post = await this.postModel.findById(id).populate('user').exec();
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return { success: true, message: '', data: post };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve post', data: null };
    }
  }
}
