import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { Plan, Prisma } from '@/generated/prisma/client.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { UsersService } from '@/users/users.service.js';

// 5 random bytes give a 7-character slug that already matches our slug rules
const GENERATED_SLUG_BYTES = 5;
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';
const FREE_LINK_LIMIT = 5;

const generateSlug = () =>
  randomBytes(GENERATED_SLUG_BYTES).toString('base64url');

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  // shortcut: a generated slug that collides returns 409, add a retry loop if it ever happens
  async create(userId: string, { slug, url }: CreateLinkDto) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPro = user.plan === Plan.PRO;
    if (slug && !isPro) {
      throw new ForbiddenException('Custom slugs are a Pro feature');
    }
    // shortcut: two simultaneous requests can both pass this count, fine for a small limit
    if (!isPro) {
      const linkCount = await this.prisma.link.count({ where: { userId } });
      if (linkCount >= FREE_LINK_LIMIT) {
        throw new ForbiddenException(
          `Free plan is limited to ${FREE_LINK_LIMIT} links`,
        );
      }
    }

    try {
      return await this.prisma.link.create({
        data: { slug: slug ?? generateSlug(), url, userId },
      });
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

  findAll(userId: string) {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.link.findUnique({ where: { slug } });
  }

  async findOne(id: string, userId: string) {
    const link = await this.prisma.link.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    if (link.userId !== userId) {
      throw new ForbiddenException('This link belongs to another user');
    }
    return link;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.link.delete({ where: { id } });
  }
}
