import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserNotificationDto } from 'src/notification/dto/create-user-notification.dto';
import { CreateAdminNotifcationDto } from '../notification/dto/create-admin-notification.dto';
import { NotificationService } from '../notification/notification.service';
import { Article, Rating } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { RatingDto } from './dto/rating.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private notificationService: NotificationService,
  ) {}

  async getArticles(): Promise<Article[]> {
    return await this.articleModel.find();
  }

  async getArticleById(id: string): Promise<Article> {
    return await this.articleModel.findById(id);
  }

  async updateArticle(
    id: string,
    updatedArticle: UpdateArticleDto,
  ): Promise<Article> {
    try {
      const newArticle: UpdateArticleDto = updatedArticle;
      newArticle.lastUpdateDate = new Date();
      await this.articleModel.findByIdAndUpdate(
        { _id: id },
        { $set: updatedArticle },
      );
      const updatedResult = await this.getArticleById(id);
      return updatedResult;
    } catch (error) {
      throw new BadRequestException('Failed to update article. ' + error);
    }
  }

  async createArticle(
    uid: string = 'no user',
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    try {
      const currentDate = new Date();
      const createResult = await this.articleModel.create({
        ...createArticleDto,
        dateCreated: createArticleDto.dateCreated || currentDate,
        dateUpdated: createArticleDto.dateUpdated || currentDate,
      });

      const adminNotification: CreateAdminNotifcationDto = {
        user_id: uid,
        role: 'moderator',
        article_id: createResult._id.toString(),
        article_title: createResult.title,
        title: 'New article submitted',
        message: 'View to get assigned',
        assigned: false,
        assignee_id: '',
      };
      const temp2: CreateUserNotificationDto = {
        user_id: uid,
        article_id: createResult._id.toString(),
        article_title: createResult.title,
        title: 'Article Approved',
        message: 'Your submitted article has been approved.',
        read: false,
      };

      if (createResult) {
        await this.notificationService.sendNotification(adminNotification);
        await this.notificationService.sendNotification(temp2);
      }
      return createResult;
    } catch (error) {
      throw new BadRequestException('Failed to create new article. ' + error);
    }
  }

  async rateArticle(id: string, ratingDto: RatingDto): Promise<Article> {
    try {
      const { userId, rating } = ratingDto;
      const currentDate = new Date();

      if (rating === 0) {
        return await this.articleModel.findOneAndUpdate(
          { _id: id, 'ratings.raterId': userId },
          { $pull: { ratings: { raterId: userId } } },
          { new: true },
        );
      }

      const article = await this.articleModel.findOneAndUpdate(
        { _id: id, 'ratings.raterId': userId },
        {
          $set: {
            'ratings.$.rating': rating,
            'ratings.$.ratedDate': currentDate,
          },
        },
        { upsert: false, new: true },
      );

      if (!article) {
        return await this.articleModel.findByIdAndUpdate(
          id,
          {
            $push: {
              ratings: { raterId: userId, rating, ratedDate: currentDate },
            },
          },
          { new: true },
        );
      }

      return article;
    } catch (error) {
      throw new BadRequestException('Failed to rate article. ' + error);
    }
  }

  async getArticleRatings(id: string): Promise<Rating[]> {
    const article = await this.articleModel.findById(id);
    if (!article) {
      throw new BadRequestException('Article not found');
    }
    return article.ratings;
  }
}
