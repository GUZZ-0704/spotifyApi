import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { Song } from './song.model';
import { AlbumModule } from '../album/album.module';
import { ArtistModule } from '../artist/artist.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => GenreModule),
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
