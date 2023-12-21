import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { ApiResponse } from 'src/interfaces/api-response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: Partial<User>): Promise<ApiResponse<User>> {
    return this.userService.create(userDto);
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
}
