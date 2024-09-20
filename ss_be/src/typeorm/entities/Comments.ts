import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comments {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    comment_id: number;

    @Column()
    story_id: string;

    @Column()
    comment: string;
    
    @Column()
    replied_to: number;

    @Column()
    user_id: number;

    @Column()
    created_ts: Date;

    @Column()
    modified_ts: Date;

    @Column()
    deleted: boolean;

    @Column()
    deleted_ts: number;
}
