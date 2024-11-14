import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  async globalSearch(@Query('search') search: string) {
    const results = await this.appService.globalSearch(search);
    return {
      message: search?.trim() ? 'Search results' : 'Default genres',
      data: results,
    };
  }
}
