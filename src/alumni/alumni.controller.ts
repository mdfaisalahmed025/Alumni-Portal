import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { CreateAlumnusDto } from './dto/create-alumnus.dto';
import { UpdateAlumnusDto } from './dto/update-alumnus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, Alumni } from './entities/alumnus.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Admin } from 'src/admin/entities/admin.entity';
import { message } from './entities/message.entity';
import { University } from './entities/university.entities';
import { Adress } from './entities/address.enity';
import { Job } from './entities/job.entity';

@Controller('alumni')
export class AlumniController {
  constructor(
    @InjectRepository(Alumni) private alumniRepository: Repository<Alumni>,
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    @InjectRepository(message) private messageRepository: Repository<message>,
    @InjectRepository(University) private universityRepository: Repository<University>,
    @InjectRepository(Adress) private AdressRepository: Repository<Adress>,
    @InjectRepository(Job) private JobRepository: Repository<Job>,
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

  @Post('/:uuid/postmessage')
  async createMessage(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const { Title, Body, Date } = req.body
    const post = new message()
    post.Title = Title
    post.Body = Body
    post.alumni = alumni
    await this.messageRepository.save({ ...post, alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Message Created successfully' });
  }


  @Get(':uuid/allmessage')
  async FindAllmessage(
    @Param('uuid') uuid: string) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const posts = await this.messageRepository.find({ where: {} })
    if (!posts) {
      throw new HttpException(
        `post not found with this`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return posts
  }


  @Post(':AlumniId/adduniversity')
  async Adduniversity(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const { Department, City, Name, } = req.body
    const university = new University()
    university.Name = Name
    university.City = City
    university.Department = Department
    university.alumni = alumni
    await this.universityRepository.save({ ...university, alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'University Added successfully' });
  }



  @Get(':uuid/myuniversity')
  async FindUniversity(
    @Param('uuid') uuid: string) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const university = await this.universityRepository.find({ where: {} })
    if (!university) {
      throw new HttpException(
        `university not found with this`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return university
  }


  @Post(':AlumniId/addAdresss')
  async AddAdress(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const { Country, ZipCode, City, } = req.body
    const address = new Adress()
    address.ZipCode = ZipCode
    address.City = City
    address.Country = Country
    address.alumni = alumni
    await this.AdressRepository.save({ ...address, alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Adress Added successfully' });
  }



  @Get(':uuid/MyAdress')
  async MyAdress(
    @Param('uuid') uuid: string) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const adress = await this.AdressRepository.find({ where: {} })
    if (!adress) {
      throw new HttpException(
        `adress not found with this`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return adress
  }



  @Post(':AlumniId/PostJob')
  async PostJob(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const { City, CompanyName, Designation } = req.body
    const job = new Job()
    job.Designation = Designation
    job.CompanyName = CompanyName
    job.City = City
    job.alumni = alumni
    await this.JobRepository.save({ ...job, alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Adress Added successfully' });
  }



  @Get(':uuid/mypost')
  async mypost(
    @Param('uuid') uuid: string) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    const job = await this.JobRepository.find({ where: {} })
    if (!job) {
      throw new HttpException(
        `adress not found with this`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return job
  }





  @Get('allalumni')
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
