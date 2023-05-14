import { Module, } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumniModule } from './alumni/alumni.module';
import { Alumni } from './alumni/entities/alumnus.entity';
import { University } from './alumni/entities/university.entities';
import { message } from './alumni/entities/message.entity';
import { Adress } from './alumni/entities/address.enity';
import { Job } from './alumni/entities/job.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from 'typeorm';
import { PostEntity } from './admin/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: "root",
      password: "",
      host: "127.0.0.1",
      database: 'alumniportal',
      port: 3306,
      autoLoadEntities: true,
      synchronize: true,
      entities: [
        Admin,
        PostEntity,
        Alumni,
        University,
      message,
        Adress,
        Job

      ],

    }),
    AlumniModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
