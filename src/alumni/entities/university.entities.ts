import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    // @ManyToOne(() => Alumni, (alumni) => alumni.university)
    // alumni: Alumni

}