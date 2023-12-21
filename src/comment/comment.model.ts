import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Posts' })
  post: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
