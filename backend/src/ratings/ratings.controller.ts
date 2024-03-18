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
import { NewRatingDto } from './dto/newRating.dto';
import { Request } from 'express';
import { UpdateRatingDto } from './dto/updateRating.dto';
import { GetRatingDto } from './dto/getRatingDto';
import { DeleteRatingDto } from './dto/deleteRating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post('')
  async newRating(@Req() request: Request, @Body() newRatingDto: NewRatingDto) {
    const { rating, movieId } = newRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.newRating(rating, movieId, userId);
  }

  @Get('')
  async getRating(@Body() getRatingDto: GetRatingDto, @Req() request: Request) {
    const { movieId } = getRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.getRating(userId, movieId);
  }

  @Patch(':ratingId')
  async updateRating(
    @Param('ratingId', ParseUUIDPipe) ratingId: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Req() request: Request,
  ) {
    const { rating, movieId } = updateRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.updateRating(ratingId, rating, movieId, userId);
  }

  @Delete(':ratingId')
  async deleteRating(
    @Param('ratingId', ParseUUIDPipe) ratingId: string,
    @Body() deleteRatingDto: DeleteRatingDto,
    @Req() request: Request,
  ) {
    const { movieId } = deleteRatingDto;
    const { sub: userId } = request['user'];
    return this.ratingsService.deleteRating(ratingId, movieId, userId);
  }
}
