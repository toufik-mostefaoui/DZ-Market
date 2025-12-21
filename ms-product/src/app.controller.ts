import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  health() {
    return { status: 'UP' };
  }

  @Get('/info')
  info() {
    return {
      service: 'ms-products',
      version: '1.0.0',
    };
  }
}
