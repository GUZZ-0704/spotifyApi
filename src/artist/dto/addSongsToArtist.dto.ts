import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddSongsToArtistDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    readonly songIds: string[];
}
