import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from '../comment/comment.module';
import { Posts, PostSchema } from './post.model';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Comment, CommentSchema } from 'src/comment/comment.model';


@Module({
  imports: [
    CommentModule,
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema }
    ])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}


