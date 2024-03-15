import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { RatingsModule } from './ratings/ratings.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MoviesModule, RatingsModule, UsersModule, AuthModule],
})
export class AppModule {}
