export class UpdateModerationDto {
  moderatorId: String;
  moderated: boolean;
  moderation_passed: boolean;
  status: string;
  comments: string;
  moderatedDate: Date;
}
