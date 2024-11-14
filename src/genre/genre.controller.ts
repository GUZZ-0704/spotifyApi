import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';
import { GenreDto } from './dto/genre.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { promisify } from 'util';
import { unlink } from 'fs';

const unlinkAsync = promisify(unlink);

@Controller("genres")
export class GenreController {
    constructor(private readonly genreService: GenreService) { }

    @Get()
    async list(): Promise<Genre[]> {
        return this.genreService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: string): Promise<Genre> {
        const genre = await this.genreService.findOne(Number(id));
        if (!genre) {
            throw new NotFoundException("Genre not found");
        }
        return genre;
    }

    @Post()
    async create(@Body() genreDto: GenreDto): Promise<Genre> {
        return this.genreService.create({
            id: 0,
            name: genreDto.name,
            artists: [],
            songs: [],
        });
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() genreDto: GenreDto): Promise<Genre> {
        const existingGenre = await this.genreService.findOne(Number(id));
        if (!existingGenre) {
            throw new NotFoundException("Genre not found");
        }
        return this.genreService.update(Number(id), {
            ...existingGenre,
            name: genreDto.name,
        });
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: string, @Body() genre: Genre): Promise<Genre> {
        const existingGenre = await this.genreService.findOne(Number(id));
        if (!existingGenre) {
            throw new NotFoundException("Genre not found");
        }
        return this.genreService.update(Number(id), {
            ...existingGenre,
            name: genre.name || existingGenre.name,
        });
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        const genre = await this.genreService.findOne(Number(id));
        if (!genre) {
            throw new NotFoundException("Genre not found");
        }
        await this.genreService.delete(Number(id));
    }

    @Post(":id/image")
    @UseInterceptors(FileInterceptor("image", {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const uploadPath = join(__dirname, "..", "..", "uploads", "genre");
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
        const genre = await this.genreService.findOne(Number(id));
        if (!genre) {
            await unlinkAsync(image.path);
            throw new NotFoundException("Genre not found");
        }
        return {
            filename: image.filename,
            path: image.path,
        };
    }


    @Get(":genreId/artists")
    async getArtistsByGenre(@Param("genreId") genreId: string) {
        return this.genreService.findArtistsByGenre(genreId);
    }

    @Patch(":genreId/add-artists")
    async addArtistsToGenre(
        @Param("genreId") genreId: string,
        @Body("artistIds") artistIds: string[],
    ): Promise<Genre> {
        const genre = await this.genreService.findOne(Number(genreId));
        if (!genre) {
            throw new NotFoundException("Genre not found");
        }
        return this.genreService.addArtistsToGenre(genreId, artistIds);
    }

    @Patch(":genreId/add-songs")
    async addSongsToGenre(
        @Param("genreId") genreId: string,
        @Body("songIds") songIds: string[],
    ): Promise<Genre> {
        const genre = await this.genreService.findOne(Number(genreId));
        if (!genre) {
            throw new NotFoundException("Genre not found");
        }
        return this.genreService.addSongsToGenre(genreId, songIds);
    }
}
