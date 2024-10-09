import { User } from 'src/user/user.schema';

export class UpdateRatingDto {
  ratedBy: User;
  rating: number;
  ratedDate: Date;
}
