import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'report' })
export class Report {
    @PrimaryGeneratedColumn({ type: "int" })
    report_id: number;

    @Column()
    reported_by: number;

    @Column()
    reported_on: string;

    @Column()
    type: string;

    @Column()
    message: string;

    @Column()
    created_ts: Date;

    @Column()
    admin_comment: string;

    @Column()
    admin_reviewed: boolean;

    @Column()
    admin_reviewed_ts: Date;
}