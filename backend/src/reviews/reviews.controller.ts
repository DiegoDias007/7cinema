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
import { ReviewsService } from './reviews.service';
import { NewReviewDto } from './dto/newReview.dto';
import { Request } from 'express';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { GetReviewsDto } from './dto/getReviews.dto';
import { DeleteReviewDto } from './dto/deleteReview.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('')
  async newReview(@Req() request: Request, @Body() newReviewDto: NewReviewDto) {
    const { review, movieId } = newReviewDto;
    const { sub: userId } = request['user'];
    return this.reviewsService.newReview(review, movieId, userId);
  }

  @Get('')
  async getReviews(@Body() getAvgReviewDto: GetReviewsDto) {
    const { movieId } = getAvgReviewDto
    return this.reviewsService.getAllReviews(movieId)
  }

  @Patch(':reviewId')
  async updateReview(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() request: Request,
  ) {
    const { review, movieId } = updateReviewDto;
    const { sub: userId } = request['user'];
    return this.reviewsService.updateReview(reviewId, review, movieId, userId);
  }

  @Delete(":reviewId")
  async deleteReview(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() deleteReviewDto: DeleteReviewDto,
    @Req() request: Request,
  ) {
    const { movieId } = deleteReviewDto;
    const { sub: userId } = request['user'];
    return this.reviewsService.deleteReview(reviewId, movieId, userId);
  }
}
