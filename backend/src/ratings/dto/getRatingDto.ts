import { IsUUID } from "class-validator";

export class GetRatingDto {
  @IsUUID()
  movieId: string;
}