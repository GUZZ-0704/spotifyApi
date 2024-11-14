import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class AlbumDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;
    @IsNotEmpty()
    readonly artistId: string;
}