import { IsUUID } from "class-validator";

export class DeleteReviewDto {
  @IsUUID()
  movieId: string;
}
