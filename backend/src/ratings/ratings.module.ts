import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, PrismaClient],
})
export class RatingsModule {}
