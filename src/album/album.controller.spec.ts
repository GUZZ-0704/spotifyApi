import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { ArtistService } from '../artist/artist.service';
import { Album } from './album.model';

describe('AlbumController', () => {
  let controller: AlbumController;
  let albumService: AlbumService;
  let artistService: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [
        {
          provide: AlbumService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({} as Album),
            create: jest.fn().mockResolvedValue({} as Album),
            update: jest.fn().mockResolvedValue({} as Album),
            delete: jest.fn(),
            addSongToAlbum: jest.fn().mockResolvedValue({} as Album),
          },
        },
        {
          provide: ArtistService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
    albumService = module.get<AlbumService>(AlbumService);
    artistService = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
