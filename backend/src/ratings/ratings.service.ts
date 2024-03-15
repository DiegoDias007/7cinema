import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaClient) {}

  async createRating(rating: number, movieId: string, userId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })
    if (!movie) throw new BadRequestException('Invalid movie id.');
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) throw new BadRequestException("Invalid user id.")

    const newRating = await this.prisma.rating.create({
      data: {
        rating,
        movieId,
        userId,
      }
    })
  }
}
