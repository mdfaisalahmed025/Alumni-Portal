import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { AlumniService } from './alumni.service';
import { CreateAlumnusDto } from './dto/create-alumnus.dto';
import { UpdateAlumnusDto } from './dto/update-alumnus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus, Alumni, UserRole } from './entities/alumnus.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { Admin } from 'src/admin/entities/admin.entity';
import { message } from './entities/message.entity';
import { University } from './entities/university.entities';
import { Adress } from './entities/address.enity';
import { Job } from './entities/job.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

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

  @Post('adminregistartion')
  async AdminRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, Password, Email, Username,ConfirmedPassword} = req.body
    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.ConfirmedPassword = ConfirmedPassword
    if(Password!==ConfirmedPassword){
      throw new HttpException("password does not match", HttpStatus.BAD_REQUEST)
    }
    registration.Role = UserRole.Admin
    await this.alumniRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Admin register successfully' });
  }

  @Post('registration/alumni')
  async AlumniRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    uuid:string,
    @Body() body
  ) {
    const { FirstName, LastName, Password, Email,ConfirmedPassword} = req.body
    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.ConfirmedPassword = ConfirmedPassword
    if(Password!==ConfirmedPassword){
      throw new HttpException("password does not match", HttpStatus.BAD_REQUEST)
    }
    const existsuser = await this.alumniRepository.find({where:{uuid}})
    if(existsuser){
     throw new HttpException("username already taken", HttpStatus.BAD_REQUEST)
   }
  
    registration.Role = UserRole.Alumni
    await this.alumniRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Alumni register successfully' });
  }


  @Post('registration/student')
  async StudentRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, Password, Email, Username,ConfirmedPassword} = req.body
    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.ConfirmedPassword = ConfirmedPassword
    if(Password!==ConfirmedPassword){
      throw new HttpException("password does not match", HttpStatus.BAD_REQUEST)
    }

    registration.Role = UserRole.Student
    await this.alumniRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'student register successfully' });
  }


  @Post('registration/faculty')
  async FacultyRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, Password, Email, Username,ConfirmedPassword} = req.body
    const registration = new Alumni()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.ConfirmedPassword = ConfirmedPassword
    if(Password!==ConfirmedPassword){
      throw new HttpException("password does not match", HttpStatus.BAD_REQUEST)
    }
    registration.Role = UserRole.Faculty
    await this.alumniRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Faculty register successfully' });
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
  async approveAlumni(
    @Param('adminId') adminId: string,
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

    alumni.status = AccountStatus.Verified
    await this.alumniRepository.save(alumni);
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'account verified successfully' });
  }

  @Post(':uuid/postmessage')
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


  @Post(':uuid/addAdresss')
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
    const { City, CompanyName, Designation } = req.body
    const job = new Job()
    job.Designation = Designation
    job.CompanyName = CompanyName
    job.City = City
    job.alumni = alumni
    await this.JobRepository.save({ ...job, alumni })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Job Post Created successfully' });
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


  @Get(':uuid/matchjob')
  async getAlumniWithMatchingProfileAndJobs(
    @Param('uuid') uuid: string,): Promise<Alumni[]> {

    const alumni = await this.alumniRepository.find({
      where: { uuid }, relations: ["address", "university"],

    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const matchingAlumni = await this.alumniRepository.find({
      where: {},
      relations: ["address", "university", "job"],
    });

    const alumniWithJobs = matchingAlumni.filter(alumni => alumni.job.length > 0);
    return alumniWithJobs;
  }

  
  @Get('dashboard/:uuid')
  async getuserdashboard(@Param('uuid') uuid:string) {
    const alumni = await this.alumniRepository.find({where:{uuid}, relations: ['address', "university", "job"],});
    if (!alumni) {
      throw new HttpException(
        `User Not Found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return alumni;
  }



  @Get('allalumni/:uuid')
  async findAll(@Param('uuid') uuid:string) {
    const admin = await this.alumniRepository.findOne({where:{uuid,Role: UserRole.Admin}});
    if (!admin) {
      throw new HttpException(
        `you dont have permission`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.alumniRepository.find({})
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
