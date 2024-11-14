import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Album } from './album.model';
import { AlbumDto } from './dto/album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { promisify } from 'util';
import { unlink } from 'fs';
import { AlbumService } from './album.service';
import { ArtistService } from '../artist/artist.service';

const unlinkAsync = promisify(unlink);

@Controller("albums")
export class AlbumController {
    constructor(private readonly albumService: AlbumService,
        private readonly artistService: ArtistService
    ) { }

    @Get()
    async list(): Promise<Album[]> {
        return this.albumService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: string): Promise<Album> {
        const album = await this.albumService.findOne(id);
        if (!album) {
            throw new NotFoundException("Album not found");
        }
        return album;
    }

    @Post()
    async create(@Body() albumDto: AlbumDto): Promise<Album> {
        const artist = await this.artistService.findOne(Number(albumDto.artistId));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        return this.albumService.create({
            id: 0,
            title: albumDto.title,
            artist: artist,
            songs: [],
        });
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() albumDto: UpdateAlbumDto): Promise<Album> {
        const artist = await this.artistService.findOne(Number(albumDto.artistId));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        const album = await this.albumService.findOne(id);
        if (!album) {
            throw new NotFoundException("Album not found");
        }
        return this.albumService.update(Number(id), {
            title: albumDto.title,
            artist
        },
            album.songs);

    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: string, @Body() albumDto: UpdateAlbumDto): Promise<Album> {
        const artist = await this.artistService.findOne(Number(albumDto.artistId));
        if (!artist) {
            throw new NotFoundException("Artist not found");
        }
        const album = await this.albumService.findOne(id);
        if (!album) {
            throw new NotFoundException("Album not found");
        }
        return this.albumService.update(Number(id), {
            title: albumDto.title,
            artist
        },
            album.songs);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        const album = await this.albumService.findOne(id);
        if (!album) {
            throw new NotFoundException("Album not found");
        }
        await this.albumService.delete(id);
    }

    @Post(":id/image")
    @UseInterceptors(FileInterceptor("image", {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const uploadPath = join(__dirname, "..", "..", "uploads", "album");
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
        const album = await this.albumService.findOne(id);
        if (!album) {
            await unlinkAsync(image.path);
            throw new NotFoundException("Album not found");
        }
        return {
            filename: image.filename,
            path: image.path,
        };
    }

    @Patch(":albumId/add-song")
    async addSongToAlbum(
        @Param("albumId") albumId: string,
        @Body("songId") songId: string,
    ): Promise<Album> {
        const album = await this.albumService.findOne(albumId);
        if (!album) {
            throw new NotFoundException("Album not found");
        }
        return this.albumService.addSongToAlbum(albumId, songId);
    }
}
