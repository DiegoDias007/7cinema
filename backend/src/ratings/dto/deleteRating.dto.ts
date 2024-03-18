import { IsUUID } from "class-validator";

export class DeleteRatingDto {
  @IsUUID()
  movieId: string;
}