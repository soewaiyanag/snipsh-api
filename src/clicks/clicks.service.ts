import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

@Injectable()
export class ClicksService {
  constructor(private readonly prisma: PrismaService) {}

  record(linkId: string) {
    return this.prisma.click.create({ data: { linkId } });
  }
}
