import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { University } from "./university.entities";
import { Adress } from "./address.enity";
import { message } from "./message.entity";
import { Job } from "./job.entity";



@Entity()
export class Alumni {
    @PrimaryGeneratedColumn('uuid')
    uuid: string
    @Column()
    FirstName: string
    @Column()
    LastName: string
    @Column()
    Email: string
    @Column()
    Password: string
    @Column()
    StudentId: string
    @Column()
    PhoneNumber: string
    @Column()
    Department: string
    @Column()
    EducationStatus: string
    @Column()
    UniversityName: string
    @Column()
    City: string
    @Column()
    Country: string

    // @Column()
    // @OneToMany(() => University, (university) => university.alumni)
    // university: University
    @OneToMany(() => message, (post) => post.alumni)
    post: message[]
    // @OneToMany(() => Adress, (adress)=>adress.alumni)
    // adress: Adress
    @OneToMany(() => Job, (job) => job.alumni)
    job: Job

}
