import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AlumniModule } from "../alumni.module";
import { Alumni } from "./alumnus.entity";


@Entity()
export class University {
    @PrimaryGeneratedColumn()
    uuid: string
    @Column({ default: null })
    Name: string
    @Column({ default: null })
    Department: string
    @Column({ default: null })
    City: string
    @ManyToOne(() => Alumni, (alumni) => alumni.university)
    alumni: Alumni

}