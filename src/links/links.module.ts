import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module.js';
import { LinksService } from './links.service.js';
import { LinksController } from './links.controller.js';

@Module({
  imports: [UsersModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
