import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class Users {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    user_id: number;

    @Column()
    email: string;
    
    @Column()
    user_name: string;

    @Column()
    password_hash: string;

    @Column()
    password_reset_code: string;

    @Column()
    password_reset_code_created_ts: Date;

    @Column()
    pfp: string;

    @Column()
    created_ts: Date;
    
    @Column()
    modified_ts: Date;

    @Column()
    verified: boolean;

    @Column()
    deleted: boolean;

    @Column()
    deleted_ts: number;


}
