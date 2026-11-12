import { Module } from '@nestjs/common';
import { ClicksModule } from '@/clicks/clicks.module.js';
import { LinksModule } from '@/links/links.module.js';
import { RedirectController } from './redirect.controller.js';

@Module({
  imports: [LinksModule, ClicksModule],
  controllers: [RedirectController],
})
export class RedirectModule {}
