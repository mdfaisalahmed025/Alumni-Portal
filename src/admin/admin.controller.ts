import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException, NotFoundException, HttpException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Request, Response } from 'express';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    @InjectRepository(PostEntity) private PostRepository: Repository<PostEntity>,
    private readonly adminService: AdminService) { }

  @Post('registration')
  async AdminRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, Password, PhoneNumber, Email } = req.body
    const registration = new Admin()
    registration.FirstName = FirstName
    registration.LastName = LastName
    registration.Email = Email
    registration.Password = Password
    registration.PhoneNumber = PhoneNumber
    registration.isAdmin = true
    await this.AdminRepository.save({ ...registration })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'user register successfully' });
  }


  @Post(':adminId/createpost')
  async createCurrentAffairs(
    @Param('Admin') adminId: string,
    @Req() req: Request,
    @Res() res: Response,

    @Body() body
  ) {
    const admin = await this.AdminRepository.findOne({ where: { adminId } });
    if (!admin) {
      throw new NotFoundException(`Alumni with ID ${adminId} not found`);
    }
    const { Title, Body, Date } = req.body
    const post = new PostEntity()
    post.Title = Title
    post.Body = Body
    post.admin = admin
    await this.PostRepository.save({ ...post, admin })
    return res.status(HttpStatus.CREATED).json({ status: "success", message: 'Post Created successfully' });
  }

  @Get('/allpost')
  async FindInstallment(
    adminId: string) {
    const admin = await this.AdminRepository.findOne({ where: { adminId } });
    if (!admin) {
      throw new NotFoundException(`Alumni with ID ${adminId} not found`);
    }
    const posts = await this.PostRepository.find({ where: {} })
    if (!posts) {
      throw new HttpException(
        `post not found with this`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return posts
  }



  async authenticateAdmin(Email: string, Password: string): Promise<boolean> {
    const admin = await this.AdminRepository.findOne({ where: { Email } });
    if (!admin) {
      return false;
    }
    if (admin.Password !== Password) {
      throw new UnauthorizedException('Invalid password');
    }
    return admin.isAdmin; // Assuming there is an `isAdmin` flag on the Admin entity
  }






  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
