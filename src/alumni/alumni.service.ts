import { Injectable } from '@nestjs/common';
import { CreateAlumnusDto } from './dto/create-alumnus.dto';
import { UpdateAlumnusDto } from './dto/update-alumnus.dto';
import { Alumni } from './entities/alumnus.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlumniService {

  constructor(  @InjectRepository(Job) private JobRepository: Repository<Job>,){}
  create(createAlumnusDto: CreateAlumnusDto) {
    return 'This action adds a new alumnus';
  }

  
 async findMatchin(alumni:Alumni): Promise<Job[]> {
  const matchingJobs = await this.JobRepository
    .createQueryBuilder('job')
    .leftJoin('job.alumni', 'alumni')
    .where('alumni.uuid != :uuid', { uuid: alumni.uuid })
    .andWhere('alumni.City = :City', { city: alumni.City })
    .andWhere('alumni.Country = :Country', { country: alumni.Country })
    .andWhere('alumni.university = :university', { university: alumni.UniversityName })
    .getMany();
  return matchingJobs;
}

  findAll() {
    return `This action returns all alumni`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alumnus`;
  }

  update(id: number, updateAlumnusDto: UpdateAlumnusDto) {
    return `This action updates a #${id} alumnus`;
  }

  remove(id: number) {
    return `This action removes a #${id} alumnus`;
  }
}
