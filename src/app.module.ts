import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validateEnv } from './config/env.validation.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LinksModule } from './links/links.module.js';
import { RedirectModule } from './redirect/redirect.module.js';
import { ClicksModule } from './clicks/clicks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    LinksModule,
    // must stay last: its /:slug route would otherwise shadow /links
    RedirectModule,
    ClicksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
