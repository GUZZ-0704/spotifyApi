import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddSongsToGenreDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    readonly songIds: string[];
}
