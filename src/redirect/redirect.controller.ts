import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '@/auth/decorators/public.decorator.js';
import {
  LINK_CLICKED,
  type LinkClickedEvent,
} from '@/clicks/events/link-clicked.event.js';
import { LinksService } from '@/links/links.service.js';

@Controller()
export class RedirectController {
  constructor(
    private readonly links: LinksService,
    private readonly events: EventEmitter2,
  ) {}

  @Public()
  @Get(':slug')
  @Redirect()
  async redirect(
    @Param('slug') slug: string,
    @Headers('referer') referrer?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    const link = await this.links.findBySlug(slug);
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    const event: LinkClickedEvent = { linkId: link.id, referrer, userAgent };
    this.events.emit(LINK_CLICKED, event);
    // 302, not 301: browsers cache a 301 forever, which would hide clicks from us
    return { url: link.url, statusCode: HttpStatus.FOUND };
  }
}
