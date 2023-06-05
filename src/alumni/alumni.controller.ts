import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException, NotFoundException, BadRequestException, HttpException, Query } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { CreateAlumnusDto } from './dto/create-alumnus.dto';
import { UpdateAlumnusDto } from './dto/update-alumnus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Admin } from 'src/admin/entities/admin.entity';
import { message } from './entities/message.entity';
import { University } from './entities/university.entities';
import { Adress } from './entities/address.enity';
import { Job } from './entities/job.entity';
import { Alumni } from './entities/alumnus.entity';
import { title } from 'process';

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
    const { FirstName, LastName, StudentId, Department, EducationStatus, Password, UniversityName,PhoneNumber, Email,Country ,City} = req.body
    const existingUser = await this.alumniRepository.findOne({ where:{Email} });
  if (existingUser) {
    return res.status(HttpStatus.BAD_REQUEST).json({ status: "error", message: 'User already exists' });
  }

    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.PhoneNumber = PhoneNumber
    registration.StudentId = StudentId
    registration.Department = Department
    registration.EducationStatus = EducationStatus
    registration.City = City
    registration.Country=Country
    registration.UniversityName = UniversityName
    await this.alumniRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'user register successfully' });
  }


  @Patch('update/:uuid')
  async Alumniupdate(
    @Param('uuid') uuid: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, StudentId, Department, EducationStatus, Password, UniversityName,PhoneNumber, Email,Country ,City} = req.body
    const alumni = await this.alumniRepository.findOne({ where: { uuid } })
    if (!alumni) {
      throw new UnauthorizedException('Invalid email');
    }

    alumni.FirstName = FirstName
    alumni.LastName = LastName
    alumni.Email = Email
    alumni.Password = Password
    alumni.PhoneNumber = PhoneNumber
    alumni.StudentId = StudentId
    alumni.Department = Department
    alumni.EducationStatus = EducationStatus
    alumni.City = City
    alumni.Country=Country
    alumni.UniversityName = UniversityName
    await this.alumniRepository.update({uuid},{ ...alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'user update successfully' });
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
  
    const admin = await this.AdminRepository.findOne({ where: { adminId } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }
    if (!admin.isAdmin) {
      throw new UnauthorizedException(`User with ID ${adminId} is not authorized to approve alumni`);
    }
    await this.alumniRepository.save(alumni);
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'account verified successfully' });
  }

  @Post(':AlumniId/postmessage')
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
    // address.alumni = alumni
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



  @Post('/PostJob/:uuid')
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
    const { City, CompanyName, Designation,Title } = req.body
    const job = new Job()
    job.Title =Title
    job.Designation = Designation
    job.CompanyName = CompanyName
    job.City = City
    job.alumni = alumni
    await this.JobRepository.save({ ...job, alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'job post created successfully' });
  }


  @Get('/dashboard/:uuid')
  async MyProfile(
    @Param('uuid') uuid: string) {
    const alumni = await this.alumniRepository.findOne({ where: { uuid }, relations:['job'] });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }

    return alumni
  }

  @Get('/match/:uuid')
  async findMatchingJobs(uuid:string): Promise<Job[]> {
    const alumni = await this.alumniRepository.findOne({ where: { uuid } });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${uuid} not found`);
    }
    if (!alumni || !alumni.City || !alumni.Country) {
      throw new Error('Invalid user object or missing properties');
    }
    const matchingJobs = await this.JobRepository
      .createQueryBuilder('jobPost')
      .where('jobPost.Title = :Title', { Title:title })
      .andWhere('jobPost.Designation = :Designation')
      .getMany();

    return matchingJobs;
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
  



  @Get('myjobs')
 async findMatchin(@Query() alumni:Alumni): Promise<Job[]> {
  const matchingJobs = await this.JobRepository
    .createQueryBuilder('job')
    .leftJoin('job.alumni', 'alumni')
    .where('alumni.uuid = :uuid', { uuid: alumni.uuid })
    // .andWhere('job.alumniUuid = :alumniid', { alumniid:alumni.uuid})
    .orWhere('alumni.City = :city', { city: alumni.City })
    .orWhere('alumni.Country = :country', { country: alumni.Country })
    .orWhere('alumni.UniversityName = :university', { university: alumni.UniversityName })
    .getMany();
    
  if (matchingJobs.length === 0) {
    throw new NotFoundException('No matching jobs found');
  }
  return matchingJobs;
}







  @Get('/job/all')
 async findAll() {
   return await this.JobRepository.find({}) 
  }

  @Delete('/delete/:uuid')
 async remove(
  @Param('uuid') uuid: string,
  @Req() req: Request,
  @Res() res: Response,
  ) {

    await this.alumniRepository.delete(uuid);
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'acccount deleted' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumniService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlumnusDto: UpdateAlumnusDto) {
    return this.alumniService.update(+id, updateAlumnusDto);
  }


}
