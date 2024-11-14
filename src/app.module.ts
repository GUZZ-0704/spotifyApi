import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Genre } from './genre/genre.model';
import { Artist } from './artist/artist.model';
import { Album } from './album/album.model';
import { Song } from './song/song.model';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AlbumController } from './album/album.controller';
import { AlbumService } from './album/album.service';
import { AlbumModule } from './album/album.module';
import { ArtistController } from './artist/artist.controller';
import { ArtistService } from './artist/artist.service';
import { ArtistModule } from './artist/artist.module';
import { GenreModule } from './genre/genre.module';
import { SongModule } from './song/song.module';

@Module({
  imports: [
    MulterModule.register({}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'practico4',
        entities: [Genre, Artist, Album, Song],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Genre, Artist, Album, Song]),
    AlbumModule,
    ArtistModule,
    GenreModule,
    SongModule,
  ],
  controllers: [AppController, AlbumController, ArtistController],
  providers: [AppService, AlbumService, ArtistService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
