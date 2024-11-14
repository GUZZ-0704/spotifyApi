import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Artist } from './artist/artist.model';
import { Album } from './album/album.model';
import { Song } from './song/song.model';
import { Genre } from './genre/genre.model';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async globalSearch(search: string) {
    if (!search || search.trim() === '') {
     const genres = await this.genreRepository.find();
      return { genres };
    }

    const artists = await this.artistRepository.find({
      where: { name: Like(`%${search}%`) },
      relations: ['albums', 'songs'],
    });

    const albums = await this.albumRepository.find({
      where: { title: Like(`%${search}%`) },
      relations: ['artist', 'songs'],
    });

    const songs = await this.songRepository.find({
      where: { title: Like(`%${search}%`) },
      relations: ['album', 'artist', 'genre'],
    });

    const genres = await this.genreRepository.find({
      where: { name: Like(`%${search}%`) },
      relations: ['artists', 'songs'],
    });

    return { artists, albums, songs, genres };
  }
}
