import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RatingsService } from 'src/ratings/ratings.service';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaClient, private ratingsService: RatingsService) {}

  public async getMovies(page = 1) {
    const moviesLength = await this.prisma.movie.count();
    const moviesPerPage = 20;
    const maxPage = Math.ceil(moviesLength / moviesPerPage);
  
    if (page > maxPage) {
      throw new BadRequestException(`Page must be less or equal to ${maxPage}.`);
    } else if (page <= 0) {
      throw new BadRequestException("Page must be a valid number greater than 0.");
    }
  
    const movies = await this.prisma.movie.findMany({
      skip: (page - 1) * moviesPerPage,
      take: moviesPerPage,
    });
  
    const ids = movies.map(movie => movie.id);
    const ratings = await this.ratingsService.getAvgRatings(ids);
  
    const moviesWithRatings = movies.map((movie, index) => ({
      ...movie,
      rating: ratings[index],
    }));
  
    return { data: moviesWithRatings };
  }
  

  public async getMovieById(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id }
    })
    const rating = await this.ratingsService.getAvgRating(id)
    if (!movie) throw new BadRequestException("Movie not found.")
    return { data: { ...movie, rating }}
  }
}
