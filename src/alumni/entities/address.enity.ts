import { Column, PrimaryGeneratedColumn } from "typeorm";


export class Adress{
    @PrimaryGeneratedColumn('uuid')
    uuid:string
    @Column()
    City:string
    @Column()
    ZipCode:string
    @Column()
    Country:string
    

}