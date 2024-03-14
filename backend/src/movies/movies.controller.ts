import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get("")
  async getAllMovies(@Query("page") page: number) {
    return this.moviesService.getMovies(page)
  }

  @Get(":id")
  async getMovieById(@Param("id") id: string) {
    return this.moviesService.getMovieById(id)
  }
}
