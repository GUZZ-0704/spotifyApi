import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            globalSearch: jest.fn().mockResolvedValue(['result1', 'result2']),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('globalSearch', () => {
    it('should return a message if no search term is provided', async () => {
      const result = await appController.globalSearch('');
      expect(result).toEqual({
        message: "Search term is required",
        data: null,
      });
    });

    it('should return search results if a search term is provided', async () => {
      const searchTerm = 'test';
      const result = await appController.globalSearch(searchTerm);
      expect(result).toEqual({
        message: "Search results",
        data: ['result1', 'result2'],
      });
      expect(appService.globalSearch).toHaveBeenCalledWith(searchTerm);
    });
  });
});
