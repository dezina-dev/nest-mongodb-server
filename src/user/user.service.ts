import { HttpException, Injectable, NotFoundException, UnauthorizedException, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { User } from './user.model';
import { ApiResponse } from 'src/interfaces/api-response';
import { ServiceExceptionFilter } from 'src/exception-filters/exception-filter';

@UseFilters(new ServiceExceptionFilter())
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(userDto: Partial<User>): Promise<ApiResponse<User>> {
    const existingUser = await this.userModel.findOne({ email: userDto.email }).exec();
    if (existingUser) {
      throw new HttpException(
        {
          success: false,
          message: 'User with this email already exists',
          data: null,
        },
        400,
      );
    }

    const hashedPassword = await User.hashPassword(userDto.password);

    const createdUser = new this.userModel({ ...userDto, password: hashedPassword });

    const savedUser = await createdUser.save();
    return { success: true, message: 'User registered successfully', data: savedUser };
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<User>> {
    const { email, password } = credentials;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await User.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    const savedUser = await user.save();

    const result = await this.userModel.findById(savedUser._id).select('-password').exec();

    return { success: true, data: result };
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

  private generateAccessToken(user: User): string {
    const accessTokenSecret = process.env.SECRET_KEY

    const expiresIn = '1h';
    return jwt.sign({ userId: user._id }, accessTokenSecret, { expiresIn });
  }

  private generateRefreshToken(user: User): string {
    const refreshTokenSecret = process.env.SECRET_KEY
    const expiresIn = '7d';
    return jwt.sign({ userId: user._id }, refreshTokenSecret, { expiresIn });
  }

  async verifyRefreshToken(refreshToken: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
      const userId = (decoded as any).userId;
      return this.userModel.findById(userId).exec();
    } catch (error) {
      return null;
    }
  }

  async generateAndSignRefreshToken(user: User): Promise<ApiResponse<User>> {
    try {
      const refreshToken = this.generateRefreshToken(user);

      user.refreshToken = refreshToken;

      const savedUser = await user.save();

      const result = await this.userModel.findById(savedUser._id).select('-password -accessToken').exec();

      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: 'Failed to generate and sign refresh token', data: null };
    }
  }

}
