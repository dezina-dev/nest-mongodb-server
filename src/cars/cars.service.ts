import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './car.model';
import { CreateCarDto } from './create-car.dto';
import { ApiResponse } from 'src/interfaces/api-response';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) {}

  async create(createCarDto: CreateCarDto): Promise<ApiResponse<Car>> {
    try {
      const createdCar = new this.carModel(createCarDto);
      const savedCar = await createdCar.save();

      return { success: true, message: 'Car created successfully', data: savedCar };
    } catch (error) {
      return { success: false, message: 'Failed to create car', data: null };
    }
  }

  async findAll(): Promise<ApiResponse<Car[]>> {
    try {
      const cars = await this.carModel.find().populate('manufacturer').exec();
      return { success: true, message: 'Cars retrieved successfully', data: cars };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve cars', data: null };
    }
  }

  async findOne(id: string): Promise<ApiResponse<Car>> {
    try {
      const car = await this.carModel.findById(id).populate('manufacturer').exec();
      if (!car) {
        throw new NotFoundException('Car not found');
      }
      return { success: true, message: 'Car retrieved successfully', data: car };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve car', data: null };
    }
  }

  async update(id: string, updateCarDto: Partial<Car>): Promise<ApiResponse<Car>> {
    try {
      const updatedCar = await this.carModel
        .findByIdAndUpdate(id, updateCarDto, { new: true })
        .exec();
      if (!updatedCar) {
        throw new NotFoundException('Car not found');
      }
      return { success: true, message: 'Car updated successfully', data: updatedCar };
    } catch (error) {
      return { success: false, message: 'Failed to update car', data: null };
    }
  }

  async remove(id: string): Promise<ApiResponse<Car | null>> {
    try {
      const deletedCar = await this.carModel.findByIdAndDelete(id).lean().exec();
      if (!deletedCar) {
        throw new NotFoundException('Car not found');
      }
      return { success: true, message: 'Car deleted successfully', data: deletedCar as Car };
    } catch (error) {
      return { success: false, message: 'Failed to delete car', data: null };
    }
  }
}
