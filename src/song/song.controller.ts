import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SongService } from './song.service';
import { Song } from './song.model';
import { SongDto } from './dto/song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { promisify } from 'util';
import { unlink } from 'fs';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { GenreService } from '../genre/genre.service';

const unlinkAsync = promisify(unlink);

@Controller("songs")
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly albumService: AlbumService,
        private readonly artistService: ArtistService,
        private readonly genreService: GenreService,
    ) {}

    @Get()
    async list(): Promise<Song[]> {
        return this.songService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: string): Promise<Song> {
        const song = await this.songService.findOne(id);
        if (!song) {
            throw new NotFoundException("Song not found");
        }
        return song;
    }

    @Post()
    async create(@Body() songDto: SongDto): Promise<Song> {
        const album = await this.albumService.findOne(songDto.albumId);
        if (!album) {
            throw new NotFoundException("Album not found");
        }

        const genre = await this.genreService.findOne(Number(songDto.genreId));
        if (!genre) {
            throw new NotFoundException("Genre not found");
        }

        return this.songService.create({
            id: 0,
            title: songDto.title,
            album: album,
            artist: album.artist,
            genre: genre,
        });
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() updateSongDto: UpdateSongDto): Promise<Song> {
        const song = await this.songService.findOne(id);
        if (!song) {
            throw new NotFoundException("Song not found");
        }

        const album = updateSongDto.albumId ? await this.albumService.findOne(updateSongDto.albumId) : song.album;
        if (updateSongDto.albumId && !album) {
            throw new NotFoundException("Album not found");
        }


        const genre = updateSongDto.genreId ? await this.genreService.findOne(Number(updateSongDto.genreId)) : song.genre;
        if (updateSongDto.genreId && !genre) {
            throw new NotFoundException("Genre not found");
        }

        return this.songService.update(Number(id), {
            title: updateSongDto.title ?? song.title,
            albumId: album?.id.toString() ?? song.album.id.toString(),
            artistId: album?.artist?.id.toString() ?? song.artist.id.toString(),
            genreId: genre?.id.toString() ?? song.genre.id.toString(),
        });
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: string, @Body() updateSongDto: UpdateSongDto): Promise<Song> {
        const song = await this.songService.findOne(id);
        if (!song) {
            throw new NotFoundException("Song not found");
        }

        const album = updateSongDto.albumId ? await this.albumService.findOne(updateSongDto.albumId) : song.album;
        if (updateSongDto.albumId && !album) {
            throw new NotFoundException("Album not found");
        }

        const artist = updateSongDto.artistId ? await this.artistService.findOne(Number(updateSongDto.artistId)) : song.artist;
        if (updateSongDto.artistId && !artist) {
            throw new NotFoundException("Artist not found");
        }

        const genre = updateSongDto.genreId ? await this.genreService.findOne(Number(updateSongDto.genreId)) : song.genre;
        if (updateSongDto.genreId && !genre) {
            throw new NotFoundException("Genre not found");
        }

        return this.songService.update(Number(id), {
            title: updateSongDto.title || song.title,
            albumId: album?.id.toString() || song.album.id.toString(),
            artistId: album?.artist?.id.toString() || song.artist.id.toString(),
            genreId: genre?.id.toString() || song.genre.id.toString(),
        });
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        const song = await this.songService.findOne(id);
        if (!song) {
            throw new NotFoundException("Song not found");
        }
        await this.songService.delete(id);
    }

    @Post(":id/file")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const uploadPath = join(__dirname, "..", "..", "uploads", "song");
                callback(null, uploadPath);
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.split(".").pop();
                if (extension !== "mp3") {
                    return callback(new BadRequestException("Only mp3 files allowed"), null);
                }
                const filename = `${req.params.id}.mp3`;
                callback(null, filename);
            },
        }),
    }))
    async uploadFile(
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        const song = await this.songService.findOne(id);
        if (!song) {
            await unlinkAsync(file.path);
            throw new NotFoundException("Song not found");
        }
        return {
            filename: file.filename,
            path: file.path,
        };
    }
}
