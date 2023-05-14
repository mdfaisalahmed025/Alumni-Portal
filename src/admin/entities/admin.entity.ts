import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostEntity } from "./post.entity";

const crypto = require('crypto');
const keyKey = 'kapjhapkappa';
const maximumValue = 100000;

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    adminId: string
    @BeforeInsert()
    async generateUniqueRandomNumber() {
        const timestamp = new Date().toISOString();
        const data = `${timestamp}-${keyKey}`;
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        const randomNumber = parseInt(hash, 16) % maximumValue;
        this.adminId = `Admin${randomNumber.toString().padStart(4, '0')}`;
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
    PhoneNumber: string
    @Column({ default: false })
    isAdmin: boolean;
    @OneToMany(() => PostEntity, (post) => post.admin)
    post: PostEntity[]
}
