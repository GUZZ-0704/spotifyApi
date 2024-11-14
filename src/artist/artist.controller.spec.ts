import { Test, TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { GenreService } from '../genre/genre.service';
import { NotFoundException } from '@nestjs/common';
import { ArtistDto } from './dto/artist.dto';
import { Artist } from './artist.model';

describe('ArtistController', () => {
  let controller: ArtistController;
  let artistService: ArtistService;
  let genreService: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        {
          provide: ArtistService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(new Artist()),
            create: jest.fn().mockResolvedValue(new Artist()),
            update: jest.fn().mockResolvedValue(new Artist()),
            delete: jest.fn().mockResolvedValue(undefined),
            addAlbumsToArtist: jest.fn().mockResolvedValue(new Artist()),
            addSongsToArtist: jest.fn().mockResolvedValue(new Artist()),
          },
        },
        {
          provide: GenreService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<ArtistController>(ArtistController);
    artistService = module.get<ArtistService>(ArtistService);
    genreService = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return an array of artists', async () => {
      const result = [];
      jest.spyOn(artistService, 'findAll').mockResolvedValue(result);

      expect(await controller.list()).toBe(result);
    });
  });

  describe('get', () => {
    it('should return a single artist', async () => {
      const artist = new Artist();
      jest.spyOn(artistService, 'findOne').mockResolvedValue(artist);

      expect(await controller.get('1')).toBe(artist);
    });

    it('should throw NotFoundException if the artist is not found', async () => {
      jest.spyOn(artistService, 'findOne').mockResolvedValue(null);

      await expect(controller.get('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new artist', async () => {
      const artistDto: ArtistDto = { name: 'New Artist', genreId: '1' };
      const artist = new Artist();
      jest.spyOn(artistService, 'create').mockResolvedValue(artist);

      expect(await controller.create(artistDto)).toBe(artist);
    });

    it('should throw NotFoundException if the genre is not found', async () => {
      jest.spyOn(genreService, 'findOne').mockResolvedValue(null);

      const artistDto: ArtistDto = { name: 'New Artist', genreId: 'non-existent-id' };
      await expect(controller.create(artistDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an artist', async () => {
      jest.spyOn(artistService, 'findOne').mockResolvedValue(new Artist());
      jest.spyOn(artistService, 'delete').mockResolvedValue(undefined);

      await controller.delete('1');
      expect(artistService.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if the artist is not found', async () => {
      jest.spyOn(artistService, 'findOne').mockResolvedValue(null);

      await expect(controller.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
