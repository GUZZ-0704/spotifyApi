import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './genre.model';
import { Repository } from 'typeorm';
import { Artist } from '../artist/artist.model';
import { Song } from '../song/song.model';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private genreRepository: Repository<Genre>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
    ) { }

    async findAll(): Promise<Genre[]> {
        return this.genreRepository.find({
            relations: ['artists', 'songs'],
        });
    }

    async findOne(id: number): Promise<Genre> {
        const genre = await this.genreRepository.findOne({
            where: { id },
            relations: ['artists', 'songs'],
        });
        if (!genre) {
            throw new NotFoundException('Genre not found');
        }
        return genre;
    }


    async create(genre: Genre): Promise<Genre> {
        return this.genreRepository.save(genre);
    }

    async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
        const genre = await this.findOne(id);
    
        if (updateGenreDto.name) {
          genre.name = updateGenreDto.name;
        }
    
        return this.genreRepository.save(genre);
      }

    async delete(id: number): Promise<void> {
        await this.genreRepository.delete(id);
    }
    async findArtistsByGenre(genreId: string): Promise<Artist[]> {
        const genre = await this.findOne(Number(genreId));
        return this.artistRepository.find({
            where: { genre: { id: genre.id } },
            relations: ['genre'],
        });
    }

    async findSongsByGenre(genreId: string): Promise<Song[]> {
        const genre = await this.findOne(Number(genreId));
        return this.songRepository.find({
            where: { genre: { id: genre.id } },
            relations: ['genre'],
        });
    }

    async addArtistsToGenre(genreId: string, artistIds: string[]): Promise<Genre> {
        const genre = await this.findOne(Number(genreId));
        const artists = await this.artistRepository.findByIds(artistIds);

        genre.artists = [...genre.artists, ...artists];
        await this.genreRepository.save(genre);
        return genre;
    }

    async addSongsToGenre(genreId: string, songIds: string[]): Promise<Genre> {
        const genre = await this.findOne(Number(genreId));
        const songs = await this.songRepository.findByIds(songIds);

        genre.songs = [...genre.songs, ...songs];
        await this.genreRepository.save(genre);
        return genre;
    }
}
