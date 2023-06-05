import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Alumni } from "./alumnus.entity";


@Entity()
export class Job{
    @PrimaryGeneratedColumn()
    jobid:string
    @Column()
    Title:string
    @Column()
    Designation:string
    @Column()
    CompanyName:string
    @Column()
    City:string
    @ManyToOne(() => Alumni, (alumni) => alumni.job,{onDelete:'CASCADE'})
    alumni: Alumni

}