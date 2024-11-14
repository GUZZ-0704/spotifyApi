import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.model';
import { UpdateSongDto } from './dto/update-song.dto';
import { Album } from 'src/album/album.model';
import { Artist } from 'src/artist/artist.model';
import { Genre } from 'src/genre/genre.model';

@Injectable()
export class SongService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>,

        @InjectRepository(Album)
        private albumRepository: Repository<Album>,

        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,

        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
    ) { }

    async findAll(): Promise<Song[]> {
        return this.songRepository.find({
            relations: ['album', 'artist', 'genre'],
        });
    }

    async findOne(id: string): Promise<Song> {
        const song = await this.songRepository.findOne({
            where: { id: Number(id) },
            relations: ['album', 'artist', 'genre'],
        });
        if (!song) {
            throw new NotFoundException('Song not found');
        }
        return song;
    }

    async create(song: Song): Promise<Song> {
        return this.songRepository.save(song);
    }

    async update(id: number, updateSongDto: UpdateSongDto): Promise<Song> {
        const song = await this.findOne(String(id));
    
        if (updateSongDto.title) {
          song.title = updateSongDto.title;
        }
        if (updateSongDto.albumId) {
          const album = await this.albumRepository.findOne({
            where: { id: Number(updateSongDto.albumId) },
          });
          if (!album) {
            throw new NotFoundException('Album not found');
          }
          song.album = album;
        }
    
        if (updateSongDto.artistId) {
          const artist = await this.artistRepository.findOne({
            where: { id: Number(updateSongDto.artistId) },
          });
          if (!artist) {
            throw new NotFoundException('Artist not found');
          }
          song.artist = artist;
        }
    
        if (updateSongDto.genreId) {
          const genre = await this.genreRepository.findOne({
            where: { id: Number(updateSongDto.genreId) },
          });
          if (!genre) {
            throw new NotFoundException('Genre not found');
          }
          song.genre = genre;
        }
    
        return this.songRepository.save(song);
      }

    async delete(id: string): Promise<void> {
        await this.songRepository.delete(id);
    }
}
