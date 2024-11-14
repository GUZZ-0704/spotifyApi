import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddArtistToGenreDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    readonly artistIds: string[];
}
