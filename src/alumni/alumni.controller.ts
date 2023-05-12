import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { CreateAlumnusDto } from './dto/create-alumnus.dto';
import { UpdateAlumnusDto } from './dto/update-alumnus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, Alumni } from './entities/alumnus.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';

@Controller('alumni')
export class AlumniController {
  constructor(@InjectRepository(Alumni) private alumniRepository: Repository<Alumni>,
    private readonly alumniService: AlumniService) { }

  @Post('registration')
  async AlumniRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, StudentId, Department, EducationStatus, Password, PhoneNUmber, Email } = req.body
    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.PhoneNUmber = PhoneNUmber
    registration.StudentId = StudentId
    registration.Department = Department
    registration.EducationStatus = EducationStatus
    await this.alumniRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'user register successfully' });
  }


  @Post('Login')
  async Login(
    @Req() req: Request,
    @Res() res: Response,
    @Body('Email') Email: string,
    @Body('Password') Password: string,

  ) {

    const alumni = await this.alumniRepository.findOne({ where: { Email } })
    if (!alumni) {
      throw new UnauthorizedException('Invalid email');
    }
    if (alumni.Password !== Password) {
      throw new UnauthorizedException('Invalid password');
    }
    if (alumni.status = AccountStatus.NotVerified) {
      throw new UnauthorizedException('Account is not verified yet');
    }
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'login successfully' });
  }






  @Get()
  findAll() {
    return this.alumniService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumniService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlumnusDto: UpdateAlumnusDto) {
    return this.alumniService.update(+id, updateAlumnusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alumniService.remove(+id);
  }
}
