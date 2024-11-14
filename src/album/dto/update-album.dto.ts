import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateAlbumDto {
    @IsString()
    @IsOptional()
    readonly title?: string;
    @IsOptional()
    readonly artistId?: string;
}