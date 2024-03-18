import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateReviewDto {
  @IsNotEmpty()
  review: string;

  @IsUUID()
  movieId: string;
}
