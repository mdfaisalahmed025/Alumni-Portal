import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { CreateAlumnusDto } from './dto/create-alumnus.dto';
import { UpdateAlumnusDto } from './dto/update-alumnus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, Alumni } from './entities/alumnus.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Admin } from 'src/admin/entities/admin.entity';

@Controller('alumni')
export class AlumniController {
  constructor(
    @InjectRepository(Alumni) private alumniRepository: Repository<Alumni>,
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    private readonly alumniService: AlumniService) { }

  @Post('registration')
  async AlumniRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, StudentId, Department, EducationStatus, Password, PhoneNumber, Email } = req.body
    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.PhoneNumber = PhoneNumber
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
    if (alumni.status == AccountStatus.NotVerified) {
      throw new UnauthorizedException('Account is not verified yet');
    }
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'login successfully' });
  }


  @Patch('verifyalumni/:uuid')
  async approveAlumni(@Param('adminId') adminId: string,
    @Res() res: Response,
    @Param('uuid') uuid: string
  ) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    if (alumni.status === AccountStatus.Verified) {
      throw new BadRequestException(`Alumni with ID ${uuid} is already verified`);
    }
    const admin = await this.AdminRepository.findOne({ where: { adminId } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }
    if (!admin.isAdmin) {
      throw new UnauthorizedException(`User with ID ${adminId} is not authorized to approve alumni`);
    }
    alumni.status = AccountStatus.Verified
    await this.alumniRepository.save(alumni);
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'account verified successfully' });
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
