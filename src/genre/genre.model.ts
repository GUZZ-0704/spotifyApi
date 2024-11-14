import { Artist } from '../artist/artist.model';
import { Song } from '../song/song.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Artist, (artist) => artist.genre, { cascade: true, onDelete: 'CASCADE' })
    artists: Artist[];

    @OneToMany(() => Song, (song) => song.genre, { cascade: true, onDelete: 'CASCADE' })
    songs: Song[];
}
