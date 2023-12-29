import { HttpException, HttpStatus, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Multer } from 'multer';
import { Posts } from './post.model';
import { Comment } from 'src/comment/comment.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { ServiceExceptionFilter } from 'src/exception-filters/exception-filter';
import { cloudinary } from 'src/utils/cloudinary.config';
import { PostDto } from './post.dto';

@UseFilters(new ServiceExceptionFilter())
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Posts.name) private readonly postModel: Model<Posts>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) { }

  async create(postDto: PostDto, image?: Multer.File): Promise<ApiResponse<Posts>> {
    try {
      const { title, content, user } = postDto;

      let imageUrl: string | undefined;

      if (image) {
        const result = await cloudinary.uploader.upload(`data:${image.mimetype};base64,${image.buffer.toString('base64')}`, {
          resource_type: 'auto',
        });

        imageUrl = result.secure_url;
      }

      const createdPost = await this.postModel.create({ title, content, user, imageUrl });

      return {
        success: true,
        message: 'Post created successfully',
        data: createdPost,
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw new HttpException('Failed to create post', HttpStatus.INTERNAL_SERVER_ERROR);
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
      const posts = await this.postModel.find().populate('user', 'username').exec();

      // Populate comments for each post
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          const comments = await this.commentModel
            .find({ post: new Types.ObjectId(post._id) })
            .populate('commentBy', 'username')
            .exec();

          return { ...post.toObject(), comments };
        })
      );

      return { success: true, data: postsWithComments };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve posts', data: null };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Posts>> {
    try {
      const post = await this.postModel.findById(id).populate('user', 'username').exec();
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

  async deleteOldPosts(thresholdDate: Date): Promise<void> {
    await this.postModel.deleteMany({ postedAt: { $lt: thresholdDate } }).exec();
  }

  // separate api for file upload
  async uploadImage(file: Multer.File): Promise<ApiResponse<Posts | null>> {
    try {

      const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
        resource_type: 'auto',
      });

      return { success: true, message: 'File uploaded successfully', data: result.secure_url };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}