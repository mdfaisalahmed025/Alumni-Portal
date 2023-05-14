import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "./admin.entity";


@Entity()
export class PostEntity {
    @PrimaryGeneratedColumn()
    uuid: string
    @Column()
    Title: string
    @Column()
    Body: string
    @CreateDateColumn()
    Date: string
    @ManyToOne(() => Admin, (admin) => admin.post, { lazy: true })
    admin: Admin

}