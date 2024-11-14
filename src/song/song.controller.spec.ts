import { Test, TestingModule } from '@nestjs/testing';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { GenreService } from '../genre/genre.service';
import { NotFoundException } from '@nestjs/common';
import { SongDto } from './dto/song.dto';
import { Song } from './song.model';

describe('SongController', () => {
  let controller: SongController;
  let songService: SongService;
  let albumService: AlbumService;
  let artistService: ArtistService;
  let genreService: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongController],
      providers: [
        {
          provide: SongService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(new Song()),
            create: jest.fn().mockResolvedValue(new Song()),
            update: jest.fn().mockResolvedValue(new Song()),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AlbumService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ArtistService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
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

    controller = module.get<SongController>(SongController);
    songService = module.get<SongService>(SongService);
    albumService = module.get<AlbumService>(AlbumService);
    artistService = module.get<ArtistService>(ArtistService);
    genreService = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return an array of songs', async () => {
      const result = [];
      jest.spyOn(songService, 'findAll').mockResolvedValue(result);

      expect(await controller.list()).toBe(result);
    });
  });

  describe('get', () => {
    it('should return a single song', async () => {
      const song = new Song();
      jest.spyOn(songService, 'findOne').mockResolvedValue(song);

      expect(await controller.get('1')).toBe(song);
    });

    it('should throw NotFoundException if the song is not found', async () => {
      jest.spyOn(songService, 'findOne').mockResolvedValue(null);

      await expect(controller.get('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new song', async () => {
      const songDto: SongDto = { title: 'New Song', albumId: '1', artistId: '1', genreId: '1' };
      const song = new Song();
      jest.spyOn(songService, 'create').mockResolvedValue(song);

      expect(await controller.create(songDto)).toBe(song);
    });

    it('should throw NotFoundException if the album is not found', async () => {
      jest.spyOn(albumService, 'findOne').mockResolvedValue(null);

      const songDto: SongDto = { title: 'New Song', albumId: 'invalid-id', artistId: '1', genreId: '1' };
      await expect(controller.create(songDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the artist is not found', async () => {
      jest.spyOn(artistService, 'findOne').mockResolvedValue(null);

      const songDto: SongDto = { title: 'New Song', albumId: '1', artistId: 'invalid-id', genreId: '1' };
      await expect(controller.create(songDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the genre is not found', async () => {
      jest.spyOn(genreService, 'findOne').mockResolvedValue(null);

      const songDto: SongDto = { title: 'New Song', albumId: '1', artistId: '1', genreId: 'invalid-id' };
      await expect(controller.create(songDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a song', async () => {
      jest.spyOn(songService, 'findOne').mockResolvedValue(new Song());
      jest.spyOn(songService, 'delete').mockResolvedValue(undefined);

      await controller.delete('1');
      expect(songService.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if the song is not found', async () => {
      jest.spyOn(songService, 'findOne').mockResolvedValue(null);

      await expect(controller.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
