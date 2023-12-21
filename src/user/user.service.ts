import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { ApiResponse } from 'src/interfaces/api-response';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(userDto: Partial<User>): Promise<ApiResponse<User>> {
    const createdUser = new this.userModel(userDto);
    const savedUser = await createdUser.save();
    return { success: true, message: 'User created successfully', data: savedUser };
  }

  async update(id: string, userDto: Partial<User>): Promise<ApiResponse<User>> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return { success: true, message: 'User updated successfully', data: updatedUser };
  }

  async delete(id: string): Promise<ApiResponse<User>> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).lean().exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return { success: true, message: 'User deleted successfully' };
  }

  async findAll(): Promise<ApiResponse<User[]>> {
    const users = await this.userModel.find().populate('posts', 'comments').exec();
    return { success: true, data: users };
  }

  async findOne(id: string): Promise<ApiResponse<User>> {
    try {
      const user = await this.userModel.findById(id).populate('posts', 'comments').exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return { success: true, message: '', data: user };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve user', data: null };
    }
  }
}
