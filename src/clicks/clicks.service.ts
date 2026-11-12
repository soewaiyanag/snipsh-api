import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

// Browsers choose these headers, so cap them to keep one visitor from filling the table
const MAX_HEADER_LENGTH = 512;

interface ClickDetails {
  referrer?: string;
  userAgent?: string;
}

@Injectable()
export class ClicksService {
  constructor(private readonly prisma: PrismaService) {}

  record(linkId: string, { referrer, userAgent }: ClickDetails = {}) {
    return this.prisma.click.create({
      data: {
        linkId,
        referrer: referrer?.slice(0, MAX_HEADER_LENGTH),
        userAgent: userAgent?.slice(0, MAX_HEADER_LENGTH),
      },
    });
  }
}
