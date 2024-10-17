import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../article/article.schema';
import { ModerateArticleDto } from './types/moderate-article.dto';
import { NotificationService } from '../notification/notification.service';
import { CreateUserNotificationDto } from '../notification/dto/create-user-notification.dto';
import { ArticleService } from '../article/article.service';
import { AnalyseArticleDto } from './types/analyse-article.dto';
import { CreateAdminNotifcationDto } from 'src/notification/dto/create-admin-notification.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private readonly notificationService: NotificationService,
    private readonly articleService: ArticleService
  ) { }

  async getModeratorQueue(): Promise<any> {
    return await this.articleModel.find({
      'moderation.moderated': false,
    });
  }

  async getAnalystQueue(): Promise<any> {
    return await this.articleModel.find({
      'moderation.moderated': true,
      'moderation.moderation_passed': true,
      'analysis.analysed': false,
    });
  }

  async moderateArticle({ articleId, moderationDetails }: ModerateArticleDto): Promise<any> {
    try {
      const updatedResult = await this.articleService.moderateArticle(articleId, moderationDetails);

      if(moderationDetails.moderation_passed) {
        const analystNotification: CreateAdminNotifcationDto = {
          user_id: updatedResult.submitterId,
          role: 'analyst',
          article_id: articleId,
          article_title: updatedResult.title,
          title: 'New article needs analysis',
          message: 'View to get assigned',
          assigned: false,
          assignee_id: '',
        }
        this.notificationService.sendNotification(analystNotification);
      }

      const userNotification: CreateUserNotificationDto = {
        user_id: updatedResult.submitterId.toString(),
        article_id: "123",
        article_title: "Rubbish",
        title: `Your article has been ${moderationDetails.status}`,
        message: `${moderationDetails.status == 'approved' ? "Congratulations, your article has been approved and now pending analysis." : "Your article has been rejected"}`,
        read: false
      }
      this.notificationService.sendNotification(userNotification);

      return { message: "Successfully moderated article" };
    } catch (error) {
      return { message: "Error in moderating article, try again or try later" }
    }
  }

  async analyseArticle({ articleId, analysisDetails }: AnalyseArticleDto): Promise<any> {
    try {
      const updatedResult = await this.articleService.analyseArticle(articleId, analysisDetails);
      const userNotification: CreateUserNotificationDto = {
        user_id: updatedResult.submitterId.toString(),
        article_id: "123",
        article_title: "Rubbish",
        title: `Your article has been ${analysisDetails.status}`,
        message: `${analysisDetails.status == 'completed' ? "Congratulations, your article has been analysed and is now visible" : "After further analysis your article has been rejected"}`,
        read: false
      }
      this.notificationService.sendNotification(userNotification);
      return { message: "Successfully analysed article" };

    } catch (error) {
      return { message: "Error in analsing article, try again or try later" }
    }
  }
}
