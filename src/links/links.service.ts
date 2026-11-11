import { randomBytes } from 'node:crypto';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { UpdateLinkDto } from './dto/update-link.dto.js';
import { Prisma } from '@/generated/prisma/client.js';
import { PrismaService } from '@/prisma/prisma.service.js';

// 5 random bytes give a 7-character slug that already matches our slug rules
const GENERATED_SLUG_BYTES = 5;
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

const generateSlug = () =>
  randomBytes(GENERATED_SLUG_BYTES).toString('base64url');

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  // shortcut: a generated slug that collides returns 409, add a retry loop if it ever happens
  async create(userId: string, { slug = generateSlug(), url }: CreateLinkDto) {
    try {
      return await this.prisma.link.create({ data: { slug, url, userId } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ConflictException('Slug is already taken');
      }
      throw error;
    }
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
