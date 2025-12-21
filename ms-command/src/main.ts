import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { eurekaClient } from 'eureka.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('ms-command')
    .setDescription('ms-command API description')
    .setVersion('1.0')
    .addTag('ms-command')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 5002);

  eurekaClient.start(error => {
    if (error) {
      console.error('❌ Eureka registration failed', error);
    } else {
      console.log('✅ Registered with Eureka');
    }
  });
}
bootstrap();
