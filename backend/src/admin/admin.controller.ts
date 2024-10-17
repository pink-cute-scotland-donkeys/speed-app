import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Moderation } from 'src/article/article.schema';
import { ModerateArticleDto } from './types/moderate-article.dto';
import { AnalyseArticleDto } from './types/analyse-article.dto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('admin')
  getDefault(): string {
    return 'admin route';
  }

  @Get('admin/queue')
  async getModeratorQueue() {
    return await this.adminService.getModeratorQueue();
  }

  @Get('admin/queue/analyst')
  async getAnalystQueue() {
    return await this.adminService.getAnalystQueue();
  }

  @Post('admin/moderate')
  async moderateArticle(@Body() body: ModerateArticleDto) {
    // console.log(body);
    return await this.adminService.moderateArticle(body);
  }

  @Post('admin/analyse')
  async analyseArticle(@Body() body: AnalyseArticleDto) {
    return await this.adminService.analyseArticle(body)
  }
}
