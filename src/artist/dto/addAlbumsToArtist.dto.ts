import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddAlbumsToArtistDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    readonly albumIds: string[];
}
