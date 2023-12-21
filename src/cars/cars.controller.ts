import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './car.model';
import { CreateCarDto } from './create-car.dto';
import { ApiResponse } from 'src/interfaces/api-response';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  async create(@Body() createCarDto: CreateCarDto): Promise<ApiResponse<Car>> {
    return this.carsService.create(createCarDto);
  }

  @Get()
  async findAll(): Promise<ApiResponse<Car[]>> {
    return this.carsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Car>> {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: Partial<Car>): Promise<ApiResponse<Car>> {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Car>> {
    return this.carsService.remove(id);
  }
}
