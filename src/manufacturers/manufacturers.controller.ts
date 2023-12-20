// src/manufacturers/manufacturers.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from './manufacturer.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  create(@Body() createManufacturerDto: Partial<Manufacturer>): Promise<ApiResponse<Manufacturer>> {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<Manufacturer[]>> {
    return this.manufacturersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponse<Manufacturer>> {
    return this.manufacturersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManufacturerDto: Partial<Manufacturer>
  ): Promise<ApiResponse<Manufacturer>> {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ApiResponse<Manufacturer>> {
    return this.manufacturersService.remove(id);
  }
}
