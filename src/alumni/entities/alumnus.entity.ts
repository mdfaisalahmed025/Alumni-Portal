import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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
}
