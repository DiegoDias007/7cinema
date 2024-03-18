import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateRatingDto {
  @IsNotEmpty()
  rating: number;
  
  @IsUUID()
  movieId: string;
}