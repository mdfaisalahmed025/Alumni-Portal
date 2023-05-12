import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Request, Response } from 'express';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumni } from 'src/alumni/entities/alumnus.entity';

@Controller('admin')
export class AdminController {
  constructor(@InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    private readonly adminService: AdminService) { }

  @Post('registration')
  async AdminRegistartion(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body
  ) {
    const { FirstName, LastName, StudentId, Department, EducationStatus, Password, PhoneNumber, Email } = req.body
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
