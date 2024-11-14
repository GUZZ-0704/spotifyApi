import { Album } from '../album/album.model';
import { Genre } from '../genre/genre.model';
import { Song } from '../song/song.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Genre, (genre) => genre.artists, { onDelete: 'CASCADE' })
    genre: Genre;

    @OneToMany(() => Album, (album) => album.artist, { cascade: true, onDelete: 'CASCADE' })
    albums: Album[];

    @OneToMany(() => Song, (song) => song.artist, { cascade: true, onDelete: 'CASCADE' })
    songs: Song[];
}
