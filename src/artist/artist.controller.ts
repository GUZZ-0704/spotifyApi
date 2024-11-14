import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Artist } from './artist.model';
import { ArtistDto } from './dto/artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistService } from './artist.service';
import { GenreService } from '../genre/genre.service';
import { AddAlbumsToArtistDto } from './dto/addAlbumsToArtist.dto';
import { AddSongsToArtistDto } from './dto/addSongsToArtist.dto';
import { promisify } from 'util';
import { unlink } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Album } from 'src/album/album.model';

const unlinkAsync = promisify(unlink);

@Controller('artists')
export class ArtistController {
    constructor(private readonly artistService: ArtistService,
        private readonly genreService: GenreService
    ) { }

    @Get()
    async list(): Promise<Artist[]> {
        return this.artistService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: string): Promise<Artist> {
        const artist = await this.artistService.findOne(Number(id));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        return artist;
    }

    @Post()
    async create(@Body() artistDto: ArtistDto): Promise<Artist> {
        const genre = await this.genreService.findOne(Number(artistDto.genreId));
        if (!genre) {
            throw new NotFoundException("Genre not found");
        }
        return this.artistService.create({
            id: 0,
            name: artistDto.name,
            genre: genre,
            albums: [],
            songs: [],
        });
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() artistDto: UpdateArtistDto): Promise<Artist> {
        const artist = await this.artistService.findOne(Number(id));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }

        const genre = await this.genreService.findOne(Number(artistDto.genreId));
        if (artistDto.genreId && !genre) {
            throw new NotFoundException("Genre not found");
        }

        return this.artistService.update(Number(id), {
            name: artistDto.name,
            genreId: genre.id.toString(),
        });
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: string, @Body() artistDto: UpdateArtistDto): Promise<Artist> {
        const artist = await this.artistService.findOne(Number(id));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }

        const genre = await this.genreService.findOne(Number(artistDto.genreId));
        if (artistDto.genreId && !genre) {
            throw new NotFoundException("Genre not found");
        }

        return this.artistService.update(Number(id), {
            name: artistDto.name || artist.name,
            genreId: genre.id.toString() || artist.genre.id.toString(),
        });
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        const artist = await this.artistService.findOne(Number(id));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        await this.artistService.delete(Number(id));
    }

    @Post(":id/image")
    @UseInterceptors(FileInterceptor("image", {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const uploadPath = join(__dirname, "..", "..", "uploads", "artist");
                callback(null, uploadPath);
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.split(".").pop();
                if (extension !== "jpg") {
                    return callback(new BadRequestException("Only jpg files allowed"), null);
                }
                const filename = `${req.params.id}.jpg`;
                callback(null, filename);
            },
        }),
    }))
    async uploadImage(
        @Param("id") id: string,
        @UploadedFile() image: Express.Multer.File
    ) {
        const artist = await this.artistService.findOne(Number(id));
        if (!artist) {
            await unlinkAsync(image.path);
            throw new NotFoundException("Artist not found");
        }
        return {
            filename: image.filename,
            path: image.path,
        };
    }

    @Get(":artistId/albums")
    async findAlbumsByArtist(@Param("artistId") artistId: string): Promise<Album[]> {
        return this.artistService.findAlbumsByArtist(Number(artistId));
    }

    @Patch(":artistId/add-albums")
    async addAlbumsToArtist(
        @Param("artistId") artistId: string,
        @Body() addAlbumsToArtistDto: AddAlbumsToArtistDto
    ): Promise<Artist> {
        const artist = await this.artistService.findOne(Number(artistId));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        return this.artistService.addAlbumsToArtist(artistId, addAlbumsToArtistDto);
    }

    @Patch(":artistId/add-songs")
    async addSongsToArtist(
        @Param("artistId") artistId: string,
        @Body() addSongsToArtistDto: AddSongsToArtistDto
    ): Promise<Artist> {
        const artist = await this.artistService.findOne(Number(artistId));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        return this.artistService.addSongsToArtist(artistId, addSongsToArtistDto);
    }
}
