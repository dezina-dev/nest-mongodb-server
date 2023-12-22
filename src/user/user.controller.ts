import { Body, Controller, Delete, Get, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { ApiResponse } from 'src/interfaces/api-response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signup')
  async create(@Body() userDto: Partial<User>): Promise<ApiResponse<User>> {
    return this.userService.create(userDto);
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }): Promise<ApiResponse<User>> {
    try {
      return this.userService.login(credentials);
    } catch (error) {
      return { success: false, message: 'Login failed', data: null };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userDto: Partial<User>): Promise<ApiResponse<User>> {
    return this.userService.update(id, userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<User>> {
    return this.userService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<User>> {
    return this.userService.findOne(id);
  }

  @Get()
  async findAll(): Promise<ApiResponse<User[]>> {
    return this.userService.findAll();
  }

  @Post('refresh-token')
  async refreshTokens(@Body() body: { refreshToken: string }): Promise<ApiResponse<{ refreshToken: string }>> {
    try {
      const { refreshToken } = body;
      const user = await this.userService.verifyRefreshToken(refreshToken);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.userService.generateAndSignRefreshToken(user);

    } catch (error) {
      throw new UnauthorizedException('Failed to refresh tokens');
    }
  }

}
