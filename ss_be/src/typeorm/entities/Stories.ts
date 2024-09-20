import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stories' })
export class Stories {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: bigint;

    @Column()
    user_id: string;
    
    @Column()
    story_id: string;

    @Column()
    created_ts: Date;
    
    @Column()
    modified_ts: Date;
    
    @Column()
    item_type: string;

    @Column()
    meta_data: string;

    @Column()
    item_order: number;

    @Column()
    payload: string;

    @Column()
    payload_number: number;

    @Column()
    published: boolean;

    @Column()
    NSFW: boolean;

    @Column()
    deleted: boolean;
}
