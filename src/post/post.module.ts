import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Posts, PostSchema } from './post.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
