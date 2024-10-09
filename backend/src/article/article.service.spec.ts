import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Article } from './article.schema';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

const mockArticleModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

describe('ArticleService', () => {
  let service: ArticleService;
  let articleModel: Model<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleModel = module.get<Model<Article>>(getModelToken(Article.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return an array of articles', async () => {
      const mockArticles = [
        { title: 'Test Article 1' },
        { title: 'Test Article 2' },
      ];
      jest.spyOn(articleModel, 'find').mockResolvedValue(mockArticles as any);

      const result = await service.getArticles();
      expect(articleModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });
  });

  describe('getArticleById', () => {
    it('should return a single article by id', async () => {
      const mockArticle = { title: 'Test Article' };
      jest
        .spyOn(articleModel, 'findById')
        .mockResolvedValue(mockArticle as any);

      const result = await service.getArticleById('1');
      expect(articleModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockArticle);
    });
  });

  describe('createArticle', () => {
    it('should create and return a new article', async () => {
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

      const mockArticle = { ...createArticleDto };

      jest.spyOn(articleModel, 'create').mockResolvedValue(mockArticle as any);

      const result = await service.createArticle(createArticleDto);
      expect(articleModel.create).toHaveBeenCalledWith(createArticleDto);
      expect(result).toEqual(mockArticle);
    });

    it('should throw a BadRequestException on failure', async () => {
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

      jest.spyOn(articleModel, 'create').mockRejectedValue(new Error('Error'));

      await expect(service.createArticle(createArticleDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateArticle', () => {
    it('should update article and return article with new details', async () => {
      const mockArticleId = '123';

      const mockNewArticle: any = {
        title: 'new title',
        author: 'new author',
        publisher: 'new publisher',
        journal: 'new journal',
        year: 2024,
        volume: 1,
        pagesStart: 10,
        pagesEnd: 20,
        doi: '10.1234/test.doi',
        isPosted: true,
        createDate: new Date(),
        lastUpdateDate: new Date(),
        moderationDetails: {
          moderatorId: 'mod id',
          moderated: false,
          moderationPassed: false,
        },
        analysisDetails: {
          analystId: 'analyst id',
          analyzed: false,
          analyzePassed: false,
        },
      };

      // Mocking the actual implemnetation of updating. Returned result is the details of the updated article.
      jest
        .spyOn(service, 'updateArticle')
        .mockImplementation(async (id, data) => {
          expect(id).toBe(mockArticleId);
          expect(data).toEqual(mockNewArticle);
          return { id: mockArticleId, ...data };
        });

      const updatedResult = await service.updateArticle('123', mockNewArticle);

      expect(updatedResult).toEqual(
        expect.objectContaining({
          id: mockArticleId,
          ...mockNewArticle,
        }),
      );
    });
  });
});
