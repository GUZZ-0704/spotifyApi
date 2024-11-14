import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './../artist/artist.model';
import { Album } from './../album/album.model';
import { Song } from './../song/song.model';
import { AddAlbumsToArtistDto } from './dto/addAlbumsToArtist.dto';
import { AddSongsToArtistDto } from './dto/addSongsToArtist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Genre } from 'src/genre/genre.model';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,

        @InjectRepository(Album)
        private albumRepository: Repository<Album>,

        @InjectRepository(Song)
        private songRepository: Repository<Song>,

        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
    ) { }

    async findAll(): Promise<Artist[]> {
        return this.artistRepository.find(
            { relations: ['genre', 'albums', 'songs'] }
        );
    }

    async findOne(id: number): Promise<Artist> {
        const artist = await this.artistRepository.findOne({
            where: { id },
            relations: ['genre', 'albums', 'songs']
        });
        if (!artist) {
            throw new NotFoundException('Artist not found');
        }
        return artist;
    }

    async create(artist: Artist): Promise<Artist> {
        return this.artistRepository.save(artist);
    }

    async update(id: number, updateArtistDto: UpdateArtistDto): Promise<Artist> {
        const artist = await this.findOne(id);
    
        if (updateArtistDto.genreId) {
          const genre = await this.genreRepository.findOne({
            where: { id: Number(updateArtistDto.genreId) },
          });
          if (!genre) {
            throw new NotFoundException('Genre not found');
          }
          artist.genre = genre;
        }
    
        artist.name = updateArtistDto.name || artist.name;
    
        return this.artistRepository.save(artist);
      }

    async delete(id: number): Promise<void> {
        await this.artistRepository.delete(id);
    }

    async findAlbumsByArtist(artistId: number): Promise<Album[]> {
        return this.albumRepository.find({
            where: { artist: { id: artistId } },
            relations: ['artist', 'songs'],
        });
    }

    async findSongsByArtist(artistId: number): Promise<Song[]> {
        return this.songRepository.find({
            where: { artist: { id: artistId } },
            relations: ['artist'],
        });
    }

    async addAlbumsToArtist(artistId: string, addAlbumsToArtistDto: AddAlbumsToArtistDto): Promise<Artist> {
        const artist = await this.findOne(Number(artistId));
        const albums = await this.albumRepository.findByIds(addAlbumsToArtistDto.albumIds);

        if (albums.length !== addAlbumsToArtistDto.albumIds.length) {
            throw new NotFoundException('One or more albums not found');
        }

        artist.albums = [...artist.albums, ...albums];
        await this.artistRepository.save(artist);
        return artist;
    }

    async addSongsToArtist(artistId: string, addSongsToArtistDto: AddSongsToArtistDto): Promise<Artist> {
        const artist = await this.findOne(Number(artistId));
        const songs = await this.songRepository.findByIds(addSongsToArtistDto.songIds);

        if (songs.length !== addSongsToArtistDto.songIds.length) {
            throw new NotFoundException('One or more songs not found');
        }

        artist.songs = [...artist.songs, ...songs];
        await this.artistRepository.save(artist);
        return artist;
    }
}
