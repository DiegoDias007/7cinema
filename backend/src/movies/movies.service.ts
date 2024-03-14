import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaClient) {}

  public async getMovies(page=1) {
    const moviesLength = await this.prisma.movie.count()
    const moviesPerPage = 20
    const maxPage = Math.ceil(moviesLength / moviesPerPage)
    if (page > maxPage) {
      throw new BadRequestException(`Page must be less or equal to ${maxPage}`)
    } else if (page <= 0) {
      throw new BadRequestException("Page must be a valid number greater than 0")
    }
    const movies = await this.prisma.movie.findMany({
      skip: (page - 1) * 20,
      take: page * 20
    })
    return movies
  }
}
