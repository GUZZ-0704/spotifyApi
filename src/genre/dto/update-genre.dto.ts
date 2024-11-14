import { IsString, IsOptional } from 'class-validator';

export class UpdateGenreDto {
    @IsString()
    @IsOptional()
    readonly name?: string;
}
