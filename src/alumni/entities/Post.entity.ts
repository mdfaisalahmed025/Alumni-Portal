

import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Alumni } from "./alumnus.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    uuid: string
    @Column()
    Title: string
    @Column()
    Body: string
    @CreateDateColumn()
    @Column()
    Date: string
    // @ManyToOne(()=>Alumni, (alumni)=>alumni.post)
    // alumni:Alumni
}