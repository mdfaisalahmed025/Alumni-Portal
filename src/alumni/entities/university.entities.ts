import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AlumniModule } from "../alumni.module";
import { Alumni } from "./alumnus.entity";


@Entity()
export class University {
    @PrimaryGeneratedColumn()
    uuid: string
    @Column()
    Name: string
    @Column()
    Department: string
    @Column()
    City: string
    university: University
    @OneToOne(() => Alumni, (alumni) => alumni.university)
    alumni: Alumni

}