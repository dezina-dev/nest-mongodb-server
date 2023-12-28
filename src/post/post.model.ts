import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Posts extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({type: Date, default: new Date})
  postedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
