import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './genre.model';
import { Artist } from '../artist/artist.model';
import { Song } from '../song/song.model';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('GenreService', () => {
  let service: GenreService;
  let genreRepository: Repository<Genre>;
  let artistRepository: Repository<Artist>;
  let songRepository: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Artist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Song),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
    artistRepository = module.get<Repository<Artist>>(getRepositoryToken(Artist));
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genres: Genre[] = [];
      jest.spyOn(genreRepository, 'find').mockResolvedValue(genres);

      expect(await service.findAll()).toBe(genres);
    });
  });

  describe('findOne', () => {
    it('should return a single genre', async () => {
      const genre = new Genre();
      jest.spyOn(genreRepository, 'findOneBy').mockResolvedValue(genre);

      expect(await service.findOne('1')).toBe(genre);
    });

    it('should throw NotFoundException if the genre is not found', async () => {
      jest.spyOn(genreRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should save and return the genre', async () => {
      const genre = new Genre();
      jest.spyOn(genreRepository, 'save').mockResolvedValue(genre);

      expect(await service.create(genre)).toBe(genre);
    });
  });

  describe('delete', () => {
    it('should delete a genre', async () => {
      jest.spyOn(genreRepository, 'delete').mockResolvedValue(undefined);

      await service.delete('1');
      expect(genreRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('addArtistsToGenre', () => {
    it('should add artists to a genre', async () => {
      const genre = new Genre();
      genre.artists = [];
      const artist = new Artist();
      const artistIds = ['artist1'];

      jest.spyOn(genreRepository, 'findOneBy').mockResolvedValue(genre);
      jest.spyOn(artistRepository, 'findByIds').mockResolvedValue([artist]);
      jest.spyOn(genreRepository, 'save').mockResolvedValue(genre);

      const result = await service.addArtistsToGenre('1', artistIds);
      expect(result.artists).toContain(artist);
    });
  });

  describe('addSongsToGenre', () => {
    it('should add songs to a genre', async () => {
      const genre = new Genre();
      genre.songs = [];
      const song = new Song();
      const songIds = ['song1'];

      jest.spyOn(genreRepository, 'findOneBy').mockResolvedValue(genre);
      jest.spyOn(songRepository, 'findByIds').mockResolvedValue([song]);
      jest.spyOn(genreRepository, 'save').mockResolvedValue(genre);

      const result = await service.addSongsToGenre('1', songIds);
      expect(result.songs).toContain(song);
    });
  });
});
