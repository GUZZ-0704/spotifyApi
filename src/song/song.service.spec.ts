import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.model';
import { NotFoundException } from '@nestjs/common';

describe('SongService', () => {
  let service: SongService;
  let songRepository: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: getRepositoryToken(Song),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SongService>(SongService);
    songRepository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of songs', async () => {
      const songs: Song[] = [];
      jest.spyOn(songRepository, 'find').mockResolvedValue(songs);

      expect(await service.findAll()).toBe(songs);
    });
  });

  describe('findOne', () => {
    it('should return a single song', async () => {
      const song = new Song();
      jest.spyOn(songRepository, 'findOneBy').mockResolvedValue(song);

      expect(await service.findOne('1')).toBe(song);
    });

    it('should throw NotFoundException if the song is not found', async () => {
      jest.spyOn(songRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should save and return the song', async () => {
      const song = new Song();
      jest.spyOn(songRepository, 'save').mockResolvedValue(song);

      expect(await service.create(song)).toBe(song);
    });
  });

  describe('update', () => {
    it('should update and return the song', async () => {
      const song = new Song();
      jest.spyOn(songRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(songRepository, 'findOneBy').mockResolvedValue(song);

      expect(await service.update('1', song)).toBe(song);
    });
  });

  describe('delete', () => {
    it('should delete a song', async () => {
      jest.spyOn(songRepository, 'delete').mockResolvedValue(undefined);

      await service.delete('1');
      expect(songRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
