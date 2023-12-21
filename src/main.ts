import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`)
}
bootstrap();
