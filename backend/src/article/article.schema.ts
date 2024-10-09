import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';

export class Rating {
  @Prop()
  ratedBy: User;

  @Prop()
  rating: number;

  @Prop({ type: Date })
  ratedDate: Date;
}

export class Moderation {
  @Prop()
  moderatedBy: User;

  @Prop()
  moderated: boolean;

  @Prop()
  status: 'not moderated' | 'pending' | 'approved' | 'rejected';

  @Prop()
  comments: string;

  @Prop({ type: Date })
  moderatedDate: Date;
}

export class Analysis {
  @Prop()
  analysedBy: User;

  @Prop()
  analysed: boolean;

  @Prop()
  status: 'not analysed' | 'pending' | 'approved' | 'rejected';

  @Prop()
  summary: string;

  @Prop()
  keyFindings: string[];

  @Prop()
  methodology: string;

  @Prop({ type: Date })
  analysedDate: Date;
}

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  publisher: string;

  @Prop()
  journal: string;

  @Prop()
  year: number;

  @Prop()
  volume: number;

  @Prop()
  pagesStart: number;

  @Prop()
  pagesEnd: number;

  @Prop()
  doi: string;

  @Prop()
  isPosted: boolean;

  @Prop()
  ratings: Rating[];

  @Prop({ type: Date })
  createDate: Date;

  @Prop({ type: Date, default: Date.now })
  lastUpdateDate: Date;

  @Prop()
  moderation: Moderation;

  @Prop()
  analysis: Analysis;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
