import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'email_domains' })
export class Email_domains {
    @PrimaryGeneratedColumn({type: "int"})
    table_id: number;

    @Column()
    domain: string;

    @Column()
    status: string;
}