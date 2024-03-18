import { IsUUID } from "class-validator";

export class GetReviewsDto {
  @IsUUID()
  movieId: string;
}
