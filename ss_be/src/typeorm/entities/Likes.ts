import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'likes' })
export class Likes {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: bigint;
    
    @Column()
    story_id: string;

    @Column()
    created_ts: Date;

    @Column()
    liked_by_id: number;
}
