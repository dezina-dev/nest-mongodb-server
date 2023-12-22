// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { PostController } from './post.controller';
// import { PostService } from './post.service';
// import { Posts, PostSchema } from './post.model';
// import { CommentModule } from 'src/comment/comment.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
//     CommentModule 
//   ],
//   controllers: [PostController],
//   providers: [PostService],
// })
// export class PostModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from '../comment/comment.module';
import { Posts, PostSchema } from './post.model';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    CommentModule,
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }])
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}


