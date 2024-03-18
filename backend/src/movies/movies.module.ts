import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaClient } from '@prisma/client';
import { RatingsService } from 'src/ratings/ratings.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, PrismaClient, RatingsService],
})
export class MoviesModule {}
