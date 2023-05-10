import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Job{
    @PrimaryGeneratedColumn()
    jobid:string
    @Column()
    Designation:string
    @Column()
    CompanyName:string
    @Column()
    City:string

}