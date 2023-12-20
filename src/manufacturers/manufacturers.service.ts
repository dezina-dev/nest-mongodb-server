import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manufacturer } from './manufacturer.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable()
export class ManufacturersService {
  constructor(@InjectModel(Manufacturer.name) private readonly manufacturerModel: Model<Manufacturer>) {}

  async create(createManufacturerDto: Partial<Manufacturer>): Promise<ApiResponse<Manufacturer>> {
    try {
      const createdManufacturer = new this.manufacturerModel(createManufacturerDto);
      const result = await createdManufacturer.save();
      return { success: true, message: 'Manufacturer created successfully', data: result };
    } catch (error) {
      return { success: false, message: 'Failed to create manufacturer', data: null };
    }
  }

  async findAll(): Promise<ApiResponse<Manufacturer[]>> {
    try {
      const manufacturers = await this.manufacturerModel.find().exec();
      return { success: true, message: 'Manufacturers retrieved successfully', data: manufacturers };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve manufacturers', data: null };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Manufacturer>> {
    try {
      const manufacturer = await this.manufacturerModel.findById(id).exec();
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      return { success: true, message: 'Manufacturer retrieved successfully', data: manufacturer };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve manufacturer', data: null };
    }
  }

  async update(id: string, updateManufacturerDto: Partial<Manufacturer>): Promise<ApiResponse<Manufacturer>> {
    try {
      const updatedManufacturer = await this.manufacturerModel
        .findByIdAndUpdate(id, updateManufacturerDto, { new: true })
        .exec();
      if (!updatedManufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      return { success: true, message: 'Manufacturer updated successfully', data: updatedManufacturer };
    } catch (error) {
      return { success: false, message: 'Failed to update manufacturer', data: null };
    }
  }

  async remove(id: string): Promise<ApiResponse<Manufacturer | null>> {
    try {
      const deletedManufacturer = await this.manufacturerModel.findByIdAndDelete(id).lean().exec();
      if (!deletedManufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      return { success: true, message: 'Manufacturer deleted successfully', data: deletedManufacturer as Manufacturer };
    } catch (error) {
      return { success: false, message: 'Failed to delete manufacturer', data: null };
    }
  }
}
