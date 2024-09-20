import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class Token {
    @PrimaryGeneratedColumn({ type: "bigint" })
    user_id: bigint;

    @Column()
    email: string;

    @Column()
    user_name: string;

    @Column()
    password_hash: string;

    @Column()
    password_reset_code: string;

    @Column()
    verified: boolean;

    @Column()
    deleted: boolean;

    @Column()
    deleted_ts: Date;
}