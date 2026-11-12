import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service.js';
import {
  LINK_CLICKED,
  type LinkClickedEvent,
} from './events/link-clicked.event.js';

// Browsers choose these headers, so cap them to keep one visitor from filling the table
const MAX_HEADER_LENGTH = 512;

@Injectable()
export class ClicksService {
  private readonly logger = new Logger(ClicksService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(LINK_CLICKED)
  async record({ linkId, referrer, userAgent }: LinkClickedEvent) {
    try {
      await this.prisma.click.create({
        data: {
          linkId,
          referrer: referrer?.slice(0, MAX_HEADER_LENGTH),
          userAgent: userAgent?.slice(0, MAX_HEADER_LENGTH),
        },
      });
    } catch (error) {
      // nobody awaits an event listener, so an uncaught error here would crash the process
      this.logger.error(`Could not record click for link ${linkId}`, error);
    }
  }

  countForLink(linkId: string) {
    return this.prisma.click.count({ where: { linkId } });
  }

  // Prisma's groupBy cannot group by the day part of a timestamp, so this one is raw SQL
  countPerDay(linkId: string) {
    return this.prisma.$queryRaw<{ day: string; clicks: number }[]>`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS day, count(*)::int AS clicks
      FROM "Click"
      WHERE "linkId" = ${linkId}::uuid
      GROUP BY day
      ORDER BY day
    `;
  }
}
