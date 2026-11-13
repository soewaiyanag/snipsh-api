import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '@/common/pagination/pagination-query.dto.js';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '@/auth/jwt-auth.guard.js';
import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createLinkDto: CreateLinkDto,
  ) {
    return this.linksService.create(user.sub, createLinkDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.linksService.findAll(user.sub, pagination);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.linksService.findOne(id, user.sub);
  }

  @Get(':id/stats')
  getStats(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.linksService.getStats(id, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.linksService.remove(id, user.sub);
  }
}
