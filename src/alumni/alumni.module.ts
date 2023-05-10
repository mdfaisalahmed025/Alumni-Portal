import { Module } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumni } from './entities/alumnus.entity';
import { University } from './entities/university.entities';
import { Post } from './entities/Post.entity';
import { Adress } from './entities/address.enity';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alumni, University, Post, Job, Adress])],
  controllers: [AlumniController],
  providers: [AlumniService]
})
export class AlumniModule { }
