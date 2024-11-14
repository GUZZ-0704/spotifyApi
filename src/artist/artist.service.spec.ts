import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artist } from './../artist/artist.model';
import { Album } from './../album/album.model';
import { Song } from './../song/song.model';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ArtistService', () => {
  let service: ArtistService;
  let artistRepository: Repository<Artist>;
  let albumRepository: Repository<Album>;
  let songRepository: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: getRepositoryToken(Artist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Album),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Song),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    artistRepository = module.get<Repository<Artist>>(getRepositoryToken(Artist));
    albumRepository = module.get<Repository<Album>>(getRepositoryToken(Album));
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of artists', async () => {
      const artists: Artist[] = [];
      jest.spyOn(artistRepository, 'find').mockResolvedValue(artists);

      expect(await service.findAll()).toBe(artists);
    });
  });

  describe('findOne', () => {
    it('should return a single artist', async () => {
      const artist = new Artist();
      jest.spyOn(artistRepository, 'findOneBy').mockResolvedValue(artist);

      expect(await service.findOne('1')).toBe(artist);
    });

    it('should throw NotFoundException if the artist is not found', async () => {
      jest.spyOn(artistRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return an artist', async () => {
      const artist = new Artist();
      jest.spyOn(artistRepository, 'save').mockResolvedValue(artist);

      expect(await service.create(artist)).toBe(artist);
    });
  });

  describe('delete', () => {
    it('should delete an artist', async () => {
      jest.spyOn(artistRepository, 'delete').mockResolvedValue(undefined);

      await service.delete('1');
      expect(artistRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('addAlbumsToArtist', () => {
    it('should add albums to an artist', async () => {
      const artist = new Artist();
      artist.albums = [];
      const album = new Album();
      const addAlbumsToArtistDto = { albumIds: ['1'] };

      jest.spyOn(artistRepository, 'findOneBy').mockResolvedValue(artist);
      jest.spyOn(albumRepository, 'findByIds').mockResolvedValue([album]);
      jest.spyOn(artistRepository, 'save').mockResolvedValue(artist);

      const result = await service.addAlbumsToArtist('1', addAlbumsToArtistDto);
      expect(result.albums).toContain(album);
    });

    it('should throw NotFoundException if one or more albums are not found', async () => {
      const artist = new Artist();
      const addAlbumsToArtistDto = { albumIds: ['1', '2'] };

      jest.spyOn(artistRepository, 'findOneBy').mockResolvedValue(artist);
      jest.spyOn(albumRepository, 'findByIds').mockResolvedValue([new Album()]);

      await expect(service.addAlbumsToArtist('1', addAlbumsToArtistDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
