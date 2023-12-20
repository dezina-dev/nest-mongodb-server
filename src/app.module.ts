import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsModule } from './cars/cars.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Dezina:dzi123**@cluster0-sosgh.mongodb.net/nestJs-mongodb?retryWrites=true&w=majority', {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    }),
    CarsModule,
    ManufacturersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
