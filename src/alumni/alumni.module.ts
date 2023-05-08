import { Module } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { AlumniController } from './alumni.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumni } from './entities/alumnus.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Alumni])],
  controllers: [AlumniController],
  providers: [AlumniService]
})
export class AlumniModule {}
