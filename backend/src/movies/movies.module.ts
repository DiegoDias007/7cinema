import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, PrismaClient],
})
export class MoviesModule {}
