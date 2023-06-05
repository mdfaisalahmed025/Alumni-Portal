import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alumni } from "./alumnus.entity";


@Entity()
export class Adress {
    @PrimaryGeneratedColumn('uuid')
    uuid: string
    @Column()
    City: string
    @Column()
    ZipCode: string
    @Column()
    Country: string
    // @ManyToOne(() => Alumni, (alumni) => alumni.adress)
    // alumni: Alumni



}