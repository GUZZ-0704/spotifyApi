import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.model';
import { Song } from './../song/song.model';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,

        @InjectRepository(Song)
        private songRepository: Repository<Song>,
    ) { }

    async findAll(): Promise<Album[]> {
        return this.albumRepository.find({ relations: ['artist', 'songs'] });
    }

    async findOne(id: string): Promise<Album> {
        const album = await this.albumRepository.findOne({ where: { id: Number(id) }, relations: ['artist', 'songs'] });
        if (!album) throw new NotFoundException('Album not found');
        return album;
    }

    async create(album: Album): Promise<Album> {
        return this.albumRepository.save(album);
    }

    async update(albumId: number, albumData: Partial<Album>, songData: Partial<Song>[]) {
        await this.albumRepository.update(albumId, albumData);
    
        if (songData && songData.length > 0) {
          for (const song of songData) {
            if (song.id) {
              await this.songRepository.update(song.id, song);
            }
          }
        }
    
        return this.albumRepository.findOne({
          where: { id: albumId },
          relations: ['songs'],
        });
      }

    async delete(id: string): Promise<void> {
        await this.albumRepository.delete(id);
    }

    async findAlbumsByArtist(artistId: string): Promise<Album[]> {
        return this.albumRepository.find({
            where: { artist: { id: Number(artistId) } },
            relations: ['artist', 'songs'],
        });
    }

    async findAlbumsByGenre(genreId: string): Promise<Album[]> {
        const albums = await this.albumRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.songs', 'song')
            .leftJoinAndSelect('song.genres', 'genre')
            .where('genre.id = :genreId', { genreId })
            .getMany();

        return albums;
    }

    async addSongToAlbum(albumId: string, songId: string): Promise<Album> {
        const album = await this.findOne(albumId);
        const song = await this.songRepository.findOneBy({ id: Number(songId) });

        if (!song) throw new NotFoundException('Song not found');

        album.songs = [...album.songs, song];
        await this.albumRepository.save(album);

        return album;
    }
}
