import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { RatingsModule } from './ratings/ratings.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [MoviesModule, RatingsModule, UsersModule, AuthModule, ReviewsModule],
})
export class AppModule {}
