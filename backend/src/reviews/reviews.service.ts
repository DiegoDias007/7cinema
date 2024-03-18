import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaClient) {}

  async newReview(review: string, movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }

    const userHasReview = await this.prisma.review.findFirst({
      where: {
        userId,
        movieId,
      }
    })
    if (userHasReview) {
      throw new BadRequestException("User has already reviewed this movie.")
    }

    const newReview = await this.prisma.review.create({
      data: {
        review,
        movieId,
        userId,
      }
    })
    return { data: newReview }
  }

  async getAllReviews(movieId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        movieId
      }
    })
    if (!reviews || reviews.length === 0) {
      throw new BadRequestException("No reviews found for this movie.")
    }
    return { data: reviews }
  }

  async updateReview(reviewId: string, review: string, movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }
    
    const prevReview = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        movieId,
        userId
      }
    })
    if (!prevReview) {
      throw new BadRequestException("Review to update not found.")
    }

    const updatedReview = await this.prisma.review.update({
      where: {
        id: reviewId,
        movieId,
        userId
      }, data: {
        review
      }
    })
    return { data: updatedReview }
  }

  async deleteReview(reviewId: string, movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }

    const review = await this.prisma.review.delete({
      where: {
        id: reviewId,
        movieId,
        userId
      }
    })

    return { data: review }
  }

  private async isInputValid(movieId: string, userId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })
    if (!movie) {
      return false
    }
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return false
    }
    return true
  }
}
