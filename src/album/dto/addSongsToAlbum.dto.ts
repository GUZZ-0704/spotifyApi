import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddSongsToAlbumDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })
  readonly songIds: string[];
}
