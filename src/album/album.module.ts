import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './album.model';
import { Song } from '../song/song.model';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { ArtistModule } from 'src/artist/artist.module';
import { SongModule } from 'src/song/song.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Album, Song]),
        forwardRef(() => ArtistModule),
        forwardRef(() => SongModule),
    ],
    controllers: [AlbumController],
    providers: [AlbumService],
    exports: [AlbumService],
})
export class AlbumModule { }
