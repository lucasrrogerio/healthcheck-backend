import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ApplicationStatus implements Log {

    @PrimaryColumn()
    timestamp!: string;

    @PrimaryColumn()
    application!: string;

    @PrimaryColumn()
    endpoint!: string;

    @Column()
    status_code!: string;

    @Column()
    status_message!: string;

    @Column()
    application_available!: number;

}