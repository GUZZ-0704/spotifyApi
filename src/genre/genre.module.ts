import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.model';
import { Song } from '../song/song.model';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { ArtistModule } from '../artist/artist.module';
import { SongModule } from '../song/song.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Genre, Song]),
    forwardRef(() => ArtistModule),
    forwardRef(() => SongModule),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
