import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { University } from "./university.entities";
import { Adress } from "./address.enity";
import { message } from "./message.entity";
import { Job } from "./job.entity";


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
    @Column({default:null})
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
    @OneToMany(() => University, (university) => university.alumni)
    university: University
    @OneToMany(() => message, (post) => post.alumni)
    post: message[]
    @OneToMany(() => Adress, (adress)=>adress.alumni)
    adress: Adress
    @OneToMany(() => Job, (job) => job.alumni)
    job: Job

}
