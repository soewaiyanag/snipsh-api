import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '@/auth/jwt-auth.guard.js';
import { LinksService } from './links.service.js';
import { CreateLinkDto } from './dto/create-link.dto.js';
import { UpdateLinkDto } from './dto/update-link.dto.js';

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
  findAll(@CurrentUser() user: JwtPayload) {
    return this.linksService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
