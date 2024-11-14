import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.model';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { AlbumModule } from '../album/album.module';
import { GenreModule } from '../genre/genre.module';
import { SongModule } from '../song/song.module';
import { Album } from '../album/album.model';
import { Song } from '../song/song.model';
import { Genre } from '../genre/genre.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([Artist, Album, Song, Genre]),
        forwardRef(() => AlbumModule),
        forwardRef(() => GenreModule),
        forwardRef(() => SongModule),
    ],
    controllers: [ArtistController],
    providers: [ArtistService],
    exports: [ArtistService, TypeOrmModule],
})
export class ArtistModule { }
