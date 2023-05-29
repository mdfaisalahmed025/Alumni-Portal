import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { University } from "./university.entities";
import { Adress } from "./address.enity";
import { message } from "./message.entity";
import { Job } from "./job.entity";


import crypto from 'crypto';
const keyKey = 'ahisdgugcocipospiocsdpkocdojmd';
const maximumValue = 10000;

export enum UserRole {
    Alumni = "Alumni",
    Faculty = "Faculty",
    Student = "Student",
    Admin ="Admin"
  }

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
        this.uuid = `NSU${randomNumber.toString().padStart(4, '0')}`;
    }
    @Column()
    FirstName: string
    @Column()
    LastName: string
    @Column()
    Email: string
    @Column({default:null})
    Password: string
    @Column({default:null})
    ConfirmedPassword: string
    @Column({
        type: "enum",
        enum: UserRole,
      })
    Role: UserRole;
    @Column({ type: 'enum', enum: AccountStatus })
    status: AccountStatus;
    @OneToMany(() => University, (university) => university.alumni)
    university: University
    @OneToMany(() => message, (post) => post.alumni)
    post: message[]
    @OneToMany(() => Adress, (adress) => adress.alumni)
    address: Adress[]
    @OneToMany(() => Job, (job) => job.alumni)
    job: Job[]

}
