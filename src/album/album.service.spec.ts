import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from './album.model';
import { Song } from './../song/song.model';
import { NotFoundException } from '@nestjs/common';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumRepository: Repository<Album>;
  let songRepository: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
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

    service = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<Album>>(getRepositoryToken(Album));
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of albums', async () => {
      const albums: Album[] = [];
      jest.spyOn(albumRepository, 'find').mockResolvedValue(albums);

      expect(await service.findAll()).toEqual(albums);
    });
  });

  describe('findOne', () => {
    it('should return a single album', async () => {
      const album = new Album();
      jest.spyOn(albumRepository, 'findOne').mockResolvedValue(album);

      expect(await service.findOne('1')).toEqual(album);
    });

    it('should throw a NotFoundException if the album is not found', async () => {
      jest.spyOn(albumRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should save and return the album', async () => {
      const album = new Album();
      jest.spyOn(albumRepository, 'save').mockResolvedValue(album);

      expect(await service.create(album)).toEqual(album);
    });
  });

  describe('delete', () => {
    it('should delete an album', async () => {
      jest.spyOn(albumRepository, 'delete').mockResolvedValue(undefined);

      await service.delete('1');
      expect(albumRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
