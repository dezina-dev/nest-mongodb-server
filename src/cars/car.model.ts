import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Manufacturer } from '../manufacturers/manufacturer.model'; // Import the Manufacturer model

@Schema()
export class Car extends Document {
  @Prop()
  brand: string;

  @Prop()
  carmodel: string;

  @Prop()
  year: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Manufacturer' }) // Reference to Manufacturer
  manufacturer: Manufacturer; // Reference to Manufacturer model
}

export const CarSchema = SchemaFactory.createForClass(Car);
