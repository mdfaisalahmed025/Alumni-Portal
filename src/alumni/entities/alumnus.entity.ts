import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { University } from "./university.entities";
import { Adress } from "./address.enity";
import { message } from "./message.entity";
import { Job } from "./job.entity";



@Entity()
export class Alumni {
    @PrimaryGeneratedColumn('uuid')
    uuid: string
    @Column({default:null})
    FirstName: string
    @Column({default:null})
    LastName: string
    @Column({default:null})
    Email: string
    @Column({default:null})
    Password: string
    @Column({default:null})
    StudentId: string
    @Column({default:null})
    PhoneNumber: string
    @Column({default:null})
    Department: string
    @Column({default:null})
    EducationStatus: string
    @Column()
    UniversityName: string
    @Column({default:null})
    City: string
    @Column({default:null})
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
