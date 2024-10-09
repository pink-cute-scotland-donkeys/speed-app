import { User } from 'src/user/user.schema';

export class UpdateAnalysisDto {
  analysedBy: User;
  analysed: boolean;
  status: boolean;
  summary: string;
  keyFindings: string[];
  methodology: string;
  analysedDate: Date;
}
