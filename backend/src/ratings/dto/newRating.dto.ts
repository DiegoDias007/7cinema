import { IsNotEmpty, IsUUID } from "class-validator";

export class NewRatingDto {
  @IsNotEmpty()
  rating: number;
  
  @IsUUID()
  movieId: string;
}