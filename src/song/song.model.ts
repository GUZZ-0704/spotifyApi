import { Album } from '../album/album.model';
import { Artist } from '../artist/artist.model';
import { Genre } from '../genre/genre.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Album, (album) => album.songs, { onDelete: 'CASCADE' })
    album: Album;

    @ManyToOne(() => Artist, (artist) => artist.songs, { onDelete: 'CASCADE' })
    artist: Artist;

    @ManyToOne(() => Genre, (genre) => genre.songs, { onDelete: 'CASCADE' })
    genre: Genre;
}
