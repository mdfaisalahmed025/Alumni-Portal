

import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class message {
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