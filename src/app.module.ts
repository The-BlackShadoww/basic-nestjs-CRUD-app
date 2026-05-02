import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';
@Module({
  imports: [ConfigModule.forRoot(), UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
