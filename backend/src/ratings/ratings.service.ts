import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaClient) {}

  async newRating(rating: number, movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }

    if (rating < 0 || rating > 5) {
      throw new BadRequestException("Rating must be between 0 and 5.")
    }

    const userHasRating = await this.prisma.rating.findMany({
      where: {
        userId,
        movieId
      }
    })
    if (userHasRating) {
      throw new BadRequestException("User has already rated this movie.")
    }

    const newRating = await this.prisma.rating.create({
      data: {
        rating,
        movieId,
        userId,
      }
    })
    return { data: newRating }
  }

  async getAvgRating(movieId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { movieId }
    })
    if (!ratings) {
      throw new BadRequestException("No ratings found.")
    }
    
    let ratingSum = 0
    for (const rating of ratings) {
      ratingSum += rating.rating
    }
    const avgRating = ratingSum / ratings.length
    return avgRating
  }

  async getAvgRatings(movieIds: string[]) {
    const ratings = await this.prisma.rating.findMany({
      where: { movieId: { in: movieIds } }
    });
  
    // Create a map to store ratings for each movie
    const ratingsMap = new Map<string, number[]>();
  
    // Populate the ratings map with ratings for each movie
    ratings.forEach(rating => {
      if (ratingsMap.has(rating.movieId)) {
        ratingsMap.get(rating.movieId).push(rating.rating);
      } else {
        ratingsMap.set(rating.movieId, [rating.rating]);
      }
    });
  
    // Calculate the average rating for each movie
    const avgRatings = movieIds.map(movieId => {
      const values = ratingsMap.get(movieId);
      if (values && values.length > 0) {
        const avgRating = values.reduce((sum, value) => sum + value, 0) / values.length;
        return avgRating;
      } else {
        return null;
      }
    });
  
    return avgRatings;
  }
      
  async getUserRating(movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }
    const rating = this.prisma.rating.findMany({
      where: {
        movieId,
        userId
      }
    })
    if (!rating) {
      throw new BadRequestException("No rating found.")
    }
    return rating
  }

  async updateRating(ratingId: string, rating: number, movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }
    
    if (rating < 0 || rating > 5) {
      throw new BadRequestException("Rating must be between 0 and 5.")
    }
    
    const prevRating = await this.prisma.rating.findUnique({
      where: {
        id: ratingId,
        movieId,
        userId
      }
    })
    if (!prevRating) {
      throw new BadRequestException("Rating to update not found.")
    }

    const newRating = await this.prisma.rating.update({
      where: {
        id: ratingId,
        movieId,
        userId
      }, data: {
        rating
      }
    })
    return { data: newRating }
  }

  async deleteRating(ratingId: string, movieId: string, userId: string) {
    const isInputValid = this.isInputValid(movieId, userId)
    if (!isInputValid) {
      throw new BadRequestException("Invalid request.")
    }

    const rating = await this.prisma.rating.delete({
      where: {
        id: ratingId,
        movieId,
        userId
      }
    })

    return { data: rating }
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
