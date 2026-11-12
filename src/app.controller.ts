import { Controller, Get } from '@nestjs/common';
import { Public } from '@/auth/decorators/public.decorator.js';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Render's health check hits this without a token
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
