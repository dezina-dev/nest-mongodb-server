import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsModule } from './cars/cars.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CronJobService } from './cron/cron-job.service';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://Dezina:dzi123**@cluster0-sosgh.mongodb.net/nestJs-mongodb?retryWrites=true&w=majority`, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    }),
    CarsModule,
    ManufacturersModule,
    UserModule,
    PostModule,
    CommentModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, CronJobService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('/*'); // Apply to all routes
  }
}
