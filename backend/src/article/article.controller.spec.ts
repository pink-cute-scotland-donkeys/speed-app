import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.schema';
import { ArticleController } from './article.controller';
import { Article } from './article.schema';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

const mockArticleService = {
  getArticles: jest.fn(),
  getArticleById: jest.fn(),
  createArticle: jest.fn(),
};

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return an array of articles', async () => {
      const mockArticles: Article[] = [
        {
          title: 'Title',
          author: 'Author',
          publisher: 'Publisher',
          journal: 'Journal',
          year: 2024,
          volume: 1,
          pagesStart: 1,
          pagesEnd: 10,
          doi: '10.1234/test.doi',
          isPosted: true,
          ratings: [
            {
              ratedBy: new User(),
              rating: 4,
              ratedDate: new Date(),
            },
            {
              ratedBy: new User(),
              rating: 5,
              ratedDate: new Date(),
            },
          ],
          createDate: new Date(),
          lastUpdateDate: new Date(),
          moderation: {
            moderatedBy: new User(),
            moderated: true,
            status: 'approved',
            comments: 'well done',
            moderatedDate: new Date(),
          },
          analysis: {
            analysedBy: new User(),
            analysed: false,
            status: 'pending',
            summary: '',
            keyFindings: [],
            methodology: '',
            analysedDate: new Date(),
          },
        },
        {
          title: 'Title 2',
          author: 'Author 2',
          publisher: 'Publisher 2',
          journal: 'Journal 2',
          year: 2020,
          volume: 2,
          pagesStart: 11,
          pagesEnd: 20,
          doi: '10.1234/test2.doi',
          isPosted: true,
          ratings: [
            {
              ratedBy: new User(),
              rating: 4,
              ratedDate: new Date(),
            },
            {
              ratedBy: new User(),
              rating: 5,
              ratedDate: new Date(),
            },
          ],
          createDate: new Date(),
          lastUpdateDate: new Date(),
          moderation: {
            moderatedBy: new User(),
            moderated: true,
            status: 'approved',
            comments: 'well done',
            moderatedDate: new Date(),
          },
          analysis: {
            analysedBy: new User(),
            analysed: false,
            status: 'pending',
            summary: '',
            keyFindings: [],
            methodology: '',
            analysedDate: new Date(),
          },
        },
      ];

      jest.spyOn(service, 'getArticles').mockResolvedValue(mockArticles);

      const result = await controller.getArticles();
      expect(service.getArticles).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });
  });

  describe('getArticleById', () => {
    it('should return a single article', async () => {
      const mockArticle: Article = {
        title: 'Title',
        author: 'Author',
        publisher: 'Publisher',
        journal: 'Journal',
        year: 2024,
        volume: 1,
        pagesStart: 1,
        pagesEnd: 10,
        doi: '10.1234/test.doi',
        isPosted: true,
        ratings: [
          {
            ratedBy: new User(),
            rating: 4,
            ratedDate: new Date(),
          },
          {
            ratedBy: new User(),
            rating: 5,
            ratedDate: new Date(),
          },
        ],
        createDate: new Date(),
        lastUpdateDate: new Date(),
        moderation: {
          moderatedBy: new User(),
          moderated: true,
          status: 'approved',
          comments: 'well done',
          moderatedDate: new Date(),
        },
        analysis: {
          analysedBy: new User(),
          analysed: false,
          status: 'pending',
          summary: '',
          keyFindings: [],
          methodology: '',
          analysedDate: new Date(),
        },
      };

      jest.spyOn(service, 'getArticleById').mockResolvedValue(mockArticle);

      const result = await controller.getArticleById('1');
      expect(service.getArticleById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockArticle);
    });
  });

  describe('addArticle', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'New Article',
        author: 'New Author',
        publisher: 'New Publisher',
        journal: 'New Journal',
        year: 2024,
        volume: 1,
        pagesStart: 10,
        pagesEnd: 20,
        doi: '10.1234/test.doi',
        isPosted: true,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      };

      const mockArticle: Article = {
        ...createArticleDto,
        ratings: [
          {
            ratedBy: new User(),
            rating: 4,
            ratedDate: new Date(),
          },
          {
            ratedBy: new User(),
            rating: 5,
            ratedDate: new Date(),
          },
        ],
        createDate: new Date(),
        lastUpdateDate: new Date(),
        moderation: {
          moderatedBy: new User(),
          moderated: true,
          status: 'approved',
          comments: 'well done',
          moderatedDate: new Date(),
        },
        analysis: {
          analysedBy: new User(),
          analysed: false,
          status: 'pending',
          summary: '',
          keyFindings: [],
          methodology: '',
          analysedDate: new Date(),
        },
      };

      jest.spyOn(service, 'createArticle').mockResolvedValue(mockArticle);

      const result = await controller.addArticle(createArticleDto);
      expect(service.createArticle).toHaveBeenCalledWith(createArticleDto);
      expect(result).toEqual(mockArticle);
    });
  });
});
