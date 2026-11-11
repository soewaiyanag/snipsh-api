import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';
import { Public } from '@/auth/decorators/public.decorator.js';
import { LinksService } from '@/links/links.service.js';

@Controller()
export class RedirectController {
  constructor(private readonly links: LinksService) {}

  @Public()
  @Get(':slug')
  @Redirect()
  async redirect(@Param('slug') slug: string) {
    const link = await this.links.findBySlug(slug);
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    // 302, not 301: browsers cache a 301 forever, which would hide clicks from us
    return { url: link.url, statusCode: HttpStatus.FOUND };
  }
}
