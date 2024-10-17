import { User } from '../../user/user.schema';

export class UpdateAnalysisDto {
  analystId: String;
  analysed: boolean;
  status: string;
  summary: string;
  keyFindings: string[];
  methodology: string;
  analysisDate: Date;
}
