import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop()
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  commentBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Posts' })
  post: string;
  
  @Prop({type: Date, default: new Date})
  commentedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
