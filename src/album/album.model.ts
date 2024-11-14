import { Artist } from '../artist/artist.model';
import { Song } from '../song/song.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'CASCADE' })
    artist: Artist;

    @OneToMany(() => Song, (song) => song.album, { cascade: true, onDelete: 'CASCADE' })
    songs: Song[];
}
