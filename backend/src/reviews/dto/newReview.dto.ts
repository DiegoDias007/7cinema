import { IsNotEmpty, IsUUID } from "class-validator";

export class NewReviewDto {
  @IsNotEmpty()
  review: string;

  @IsUUID()
  movieId: string;
}
