import { Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { University } from "./university.entities";
import { Post } from "./Post.entity";
import { Adress } from "./address.enity";

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
    PhoneNUmber: string
    @Column()
    Department: string
    @Column()
    EducationStatus: string
    @OneToOne(() => University, (university) => university.alumni)
    university: University
    // @OneToMany(() => Post, (post) => post.alumni)
    // post: Post[]
    // @OneToOne(() => Adress)
    // adress: Adress

}
