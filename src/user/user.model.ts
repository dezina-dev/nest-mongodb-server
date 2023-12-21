import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }] })
  posts: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }] })
  comments: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
