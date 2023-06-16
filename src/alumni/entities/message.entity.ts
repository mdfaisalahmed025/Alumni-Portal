

import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Alumni } from "./alumnus.entity";

@Entity()
export class message {
    @PrimaryGeneratedColumn()
    uuid: string
    @Column()
    Name: string
    @Column({ default: null })
    Title: string
    @Column({ default: null })
    Body: string
    @CreateDateColumn()
    @Column()
    Date: string
    @ManyToOne(() => Alumni, (alumni) => alumni.post, { onDelete: 'CASCADE' })
    alumni: Alumni
}