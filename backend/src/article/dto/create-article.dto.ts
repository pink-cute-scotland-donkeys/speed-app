export class CreateArticleDto {
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
  dateCreated: Date;
  dateUpdated: Date;
}
