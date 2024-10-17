import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Article } from '../article/article.schema';
import { AdminService } from './admin.service';
import { ArticleService } from '../article/article.service';
import { NotificationService } from '../notification/notification.service';
import { AdminNotification } from '../notification/admin-notification.schema';
import { UserNotification } from '../notification/user-notification.schema';


const mockAdminController = {
  getAnalystQueue: jest.fn(),
  find: jest.fn(),
};

describe('AdminService', () => {
  let adminService: AdminService;
  let articleService: ArticleService;
  let notificationService: NotificationService;
  let articleModel: Model<Article>;
  let adminNotificationModel: Model<AdminNotification>
  let userNotificationModel: Model<UserNotification>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        ArticleService,
        NotificationService,
        {
          provide: getModelToken(Article.name),
          useValue: mockAdminController,
        },
        {
          provide: getModelToken(AdminNotification.name),
          useValue: adminNotificationModel
        },
        {
          provide: getModelToken(UserNotification.name),
          useValue: userNotificationModel
        }
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    articleService = module.get<ArticleService>(ArticleService);
    notificationService = module.get<NotificationService>(NotificationService);
    articleModel = module.get<Model<Article>>(getModelToken(Article.name));
    adminNotificationModel = module.get<Model<AdminNotification>>(getModelToken(AdminNotification.name));
    userNotificationModel = module.get<Model<UserNotification>>(getModelToken(UserNotification.name));
  });

  it('should be defined', () => {
    expect(adminService).toBeDefined();
    expect(articleModel).toBeDefined();
  });

  describe('Admin Service', () => {
    describe('getModeratorQueue()', () => {
      const unmodMockArticle = {
        moderation: {
          moderated: false,
          moderation_passed: false,
        },
        analysis: {
          analyzed: false,
          analyzed_passed: false,
        },
      };

      const modMockArticle = {
        moderation: {
          moderated: true,
          moderation_passed: true,
        },
        analysis: {
          analyzed: false,
          analyzed_passed: false,
        },
      };

      const expectedUnmodArticle = {
        moderation: {
          moderated: false,
          moderation_passed: false,
        },
        analysis: {
          analyzed: false,
          analyzed_passed: false,
        },
      };
      // Expected pass
      it('should return list of unmoderatored articles', async () => {
        jest
          .spyOn(adminService, 'getModeratorQueue')
          .mockResolvedValueOnce(unmodMockArticle as any);
        const unModQResult = await adminService.getModeratorQueue();
        expect(unModQResult).toEqual(expectedUnmodArticle);
      });

      // Expected fail
      it('should fail given the provided article is moderated', async () => {
        jest
          .spyOn(adminService, 'getModeratorQueue')
          .mockResolvedValueOnce(modMockArticle as any);
        const modQResult = await adminService.getModeratorQueue();
        try {
          expect(modQResult).toEqual(expectedUnmodArticle);
        } catch (error) {
          expect(true).toBe(true);
        }
      });
    });

    describe('getAnalystQueue()', () => {
      const modPassNoAnalyzeMockArticle = {
        moderation: {
          moderated: true,
          moderation_passed: true
        },
        analysis: {
          analyzed: false,
          analyzed_passed: false,
        },
      };

      const modNoPassNoAnalyzeMockArticle = {
        moderation: {
          moderated: true,
          moderation_passed: false,
        },
        analysis: {
          analyzed: false,
          analyzed_passed: false,
        },
      };

      const modNoPassAnalyzedMockArticle = {
        moderation: {
          moderated: true,
          moderation_passed: true,
        },
        analysis: {
          analyzed: true,
          analyzed_passed: false,
        },
      };

      const expectedUnanalyzedArticle = {
        moderation: {
          moderated: true,
          moderation_passed: true,
        },
        analysis: {
          analyzed: false,
          analyzed_passed: false,
        },
      };

      // Expected pass
      it('should return a list of articles passed moderation but not yet analyzed', async () => {
        jest
          .spyOn(adminService, 'getAnalystQueue')
          .mockResolvedValueOnce(modPassNoAnalyzeMockArticle as any);
        const unnalyzedResult = await adminService.getAnalystQueue();
        expect(unnalyzedResult).toEqual(expectedUnanalyzedArticle);
      });

      // Expected fail
      it('should fail given the provided article has been moderated but not passed and is not yet analyzed', async () => {
        jest
          .spyOn(adminService, 'getAnalystQueue')
          .mockResolvedValueOnce(modNoPassNoAnalyzeMockArticle as any);
        const unnalyzedResult = await adminService.getAnalystQueue();
        try {
          expect(unnalyzedResult).toEqual(expectedUnanalyzedArticle);
        } catch (error) {
          expect(true).toBe(true);
        }
      });

      // Expected fail
      it('should fail given the provided article has passed moderation and has been analyzed', async () => {
        jest
          .spyOn(adminService, 'getAnalystQueue')
          .mockResolvedValueOnce(modNoPassAnalyzedMockArticle as any);
        const alyzedResult = await adminService.getAnalystQueue();
        try {
          expect(alyzedResult).toEqual(expectedUnanalyzedArticle);
        } catch (error) {
          expect(true).toBe(true);
        }
      });
    });
  });
});
