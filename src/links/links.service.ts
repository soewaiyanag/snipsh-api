import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { UpdateLinkDto } from './dto/update-link.dto.js';
import { Plan, Prisma } from '@/generated/prisma/client.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { UsersService } from '@/users/users.service.js';

// 5 random bytes give a 7-character slug that already matches our slug rules
const GENERATED_SLUG_BYTES = 5;
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

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
    if (slug && user.plan !== Plan.PRO) {
      throw new ForbiddenException('Custom slugs are a Pro feature');
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
