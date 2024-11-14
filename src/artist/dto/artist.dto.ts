import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ArtistDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
    @IsNotEmpty()
    readonly genreId: string;
}
