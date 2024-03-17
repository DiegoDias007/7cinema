import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { newRatingDto } from './dto/newRating.dto';
import { Request } from 'express';
import { updateRatingDto } from './dto/updateRating.dto';
import { getAvgRatingDto } from './dto/getAvgRating.dto';
import { deleteRatingDto } from './dto/deleteRating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('')
  async newRating(@Req() request: Request, @Body() newRatingDto: newRatingDto) {
    const { rating, movieId } = newRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.newRating(rating, movieId, userId);
  }

  @Get('')
  async getAvgRating(@Body() getAvgRatingDto: getAvgRatingDto) {
    const { movieId } = getAvgRatingDto
    return this.ratingsService.getAvgRating(movieId)
  }

  @Patch(':ratingId')
  async updateRating(
    @Param('ratingId', ParseUUIDPipe) ratingId: string,
    @Body() updateRatingDto: updateRatingDto,
    @Req() request: Request,
  ) {
    const { rating, movieId } = updateRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.updateRating(ratingId, rating, movieId, userId);
  }

  @Delete(":ratingId")
  async deleteRating(
    @Param('ratingId', ParseUUIDPipe) ratingId: string,
    @Body() deleteRatingDto: deleteRatingDto,
    @Req() request: Request,
  ) {
    const { movieId } = deleteRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.deleteRating(ratingId, movieId, userId);
  }
}
