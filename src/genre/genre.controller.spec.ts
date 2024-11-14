import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { NotFoundException } from '@nestjs/common';
import { GenreDto } from './dto/genre.dto';
import { Genre } from './genre.model';

describe('GenreController', () => {
  let controller: GenreController;
  let genreService: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(new Genre()),
            create: jest.fn().mockResolvedValue(new Genre()),
            update: jest.fn().mockResolvedValue(new Genre()),
            delete: jest.fn().mockResolvedValue(undefined),
            addArtistsToGenre: jest.fn().mockResolvedValue(new Genre()),
            addSongsToGenre: jest.fn().mockResolvedValue(new Genre()),
          },
        },
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
    genreService = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return an array of genres', async () => {
      const result = [];
      jest.spyOn(genreService, 'findAll').mockResolvedValue(result);

      expect(await controller.list()).toBe(result);
    });
  });

  describe('get', () => {
    it('should return a single genre', async () => {
      const genre = new Genre();
      jest.spyOn(genreService, 'findOne').mockResolvedValue(genre);

      expect(await controller.get('1')).toBe(genre);
    });

    it('should throw NotFoundException if the genre is not found', async () => {
      jest.spyOn(genreService, 'findOne').mockResolvedValue(null);

      await expect(controller.get('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new genre', async () => {
      const genreDto: GenreDto = { name: 'New Genre' };
      const genre = new Genre();
      jest.spyOn(genreService, 'create').mockResolvedValue(genre);

      expect(await controller.create(genreDto)).toBe(genre);
    });
  });

  describe('delete', () => {
    it('should delete a genre', async () => {
      jest.spyOn(genreService, 'findOne').mockResolvedValue(new Genre());
      jest.spyOn(genreService, 'delete').mockResolvedValue(undefined);

      await controller.delete('1');
      expect(genreService.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if the genre is not found', async () => {
      jest.spyOn(genreService, 'findOne').mockResolvedValue(null);

      await expect(controller.delete('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addArtistsToGenre', () => {
    it('should add artists to a genre', async () => {
      const genre = new Genre();
      jest.spyOn(genreService, 'findOne').mockResolvedValue(genre);
      jest.spyOn(genreService, 'addArtistsToGenre').mockResolvedValue(genre);

      expect(await controller.addArtistsToGenre('1', ['artist1'])).toBe(genre);
    });
  });

  describe('addSongsToGenre', () => {
    it('should add songs to a genre', async () => {
      const genre = new Genre();
      jest.spyOn(genreService, 'findOne').mockResolvedValue(genre);
      jest.spyOn(genreService, 'addSongsToGenre').mockResolvedValue(genre);

      expect(await controller.addSongsToGenre('1', ['song1'])).toBe(genre);
    });
  });
});
