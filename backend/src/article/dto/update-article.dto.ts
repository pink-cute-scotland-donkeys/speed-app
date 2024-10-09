import { Analysis, Moderation, Rating } from '../article.schema';

export class UpdateArticleDto {
  title: string;
  author: string;
  publisher: string;
  journal: string;
  year: number;
  volume: number;
  pagesStart: number;
  pagesEnd: number;
  doi: string;
  isPosted: boolean;
  ratings: Rating[];
  createDate: Date;
  lastUpdateDate: Date;
  moderation: Moderation;
  analysis: Analysis;
}
