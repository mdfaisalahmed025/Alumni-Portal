import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Alumni } from "./alumnus.entity";


@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    jobid: string
    @Column({ default: null })
    Designation: string
    @Column({ default: null })
    CompanyName: string
    @Column({ default: null })
    City: string
    @ManyToOne(() => Alumni, (alumni) => alumni.job)
    alumni: Alumni

}