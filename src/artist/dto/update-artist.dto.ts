import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateArtistDto {
    @IsString()
    @IsOptional()
    readonly name?: string;
    @IsOptional()
    readonly genreId?: string;
}
