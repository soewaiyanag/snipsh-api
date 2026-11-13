import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClicksService } from '@/clicks/clicks.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { Plan, Prisma } from '@/generated/prisma/client.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { UsersService } from '@/users/users.service.js';

// 5 random bytes give a 7-character slug that already matches our slug rules
const GENERATED_SLUG_BYTES = 5;
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';
const FREE_LINK_LIMIT = 5;
// First path segments of real routes. Keep in sync with the controllers; Express ignores case.
const RESERVED_SLUGS = ['links', 'auth', 'users', 'admin', 'docs', 'docs-json'];

const generateSlug = () =>
  randomBytes(GENERATED_SLUG_BYTES).toString('base64url');

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly clicks: ClicksService,
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
    if (slug && RESERVED_SLUGS.includes(slug.toLowerCase())) {
      throw new ConflictException('That slug is reserved');
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

  findAll(userId: string, { page, limit }: PaginationQueryDto) {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
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

  async getStats(id: string, userId: string) {
    await this.findOne(id, userId);
    const [totalClicks, clicksPerDay, topReferrers] = await Promise.all([
      this.clicks.countForLink(id),
      this.clicks.countPerDay(id),
      this.clicks.topReferrers(id),
    ]);
    return { totalClicks, clicksPerDay, topReferrers };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.link.delete({ where: { id } });
  }
}
