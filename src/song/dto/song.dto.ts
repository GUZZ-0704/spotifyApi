import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SongDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;
    @IsNotEmpty()
    readonly albumId: string;
    readonly artistId: string;
    @IsNotEmpty()
    readonly genreId: string;
}
