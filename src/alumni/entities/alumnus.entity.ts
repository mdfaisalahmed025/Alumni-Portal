import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { University } from "./university.entities";
import { Post } from "./Post.entity";
import { Adress } from "./address.enity";


const crypto = require('crypto');
const keyKey = 'kapjhapkappa';
const maximumValue = 100000;

export enum AccountStatus {
    NotVerified = 'Notverified',
    Verified = 'Verified',

}

@Entity()
export class Alumni {
    @PrimaryGeneratedColumn('uuid')
    uuid: string
    @BeforeInsert()
    async generateUniqueRandomNumber() {
        const timestamp = new Date().toISOString();
        const data = `${timestamp}-${keyKey}`;
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        const randomNumber = parseInt(hash, 16) % maximumValue;
        this.uuid = `Alumni${randomNumber.toString().padStart(4, '0')}`;
    }
    @Column()
    FirstName: string
    @Column()
    LastName: string
    @Column()
    Email: string
    @Column()
    Password: string
    @Column()
    StudentId: string
    @Column()
    PhoneNumber: string
    @Column()
    Department: string
    @Column()
    EducationStatus: string
    @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.NotVerified })
    status: AccountStatus;
    @OneToOne(() => University, (university) => university.alumni)
    university: University
    // @OneToMany(() => Post, (post) => post.alumni)
    // post: Post[]
    // @OneToOne(() => Adress)
    // adress: Adress

}
