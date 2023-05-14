import { Module } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumni } from './entities/alumnus.entity';
import { University } from './entities/university.entities';
import {  message } from './entities/message.entity';
import { Adress } from './entities/address.enity';
import { Job } from './entities/job.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alumni, University,message, Job, Adress, Admin]), AdminModule],
  controllers: [AlumniController],
  providers: [AlumniService]
})
export class AlumniModule { }
