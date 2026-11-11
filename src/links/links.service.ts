import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { UpdateLinkDto } from './dto/update-link.dto.js';
import { PrismaService } from '@/prisma/prisma.service.js';

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, { slug, url }: CreateLinkDto) {
    return this.prisma.link.create({
      data: { slug, url, userId },
    });
  }

  findAll() {
    return this.prisma.link.findMany();
  }

  findOne(id: string) {
    return this.prisma.link.findUnique({ where: { id } });
  }

  update(id: string, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link`;
  }

  remove(id: string) {
    return `This action removes a #${id} link`;
  }
}
