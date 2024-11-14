import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateSongDto {
    @IsString()
    @IsOptional()
    readonly title?: string;
    @IsOptional()
    readonly albumId?: string;
    @IsOptional()
    readonly artistId?: string;
    @IsOptional()
    readonly genreId?: string;
}
