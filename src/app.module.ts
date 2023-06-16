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
import { PostEntity } from './admin/entities/post.entity';
import { Admin } from './admin/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: "root",
      password: "hYF49ONrrHOxjVMYyGoh",
      host: "containers-us-west-43.railway.app",
      database: 'railway',
      port: 6817,
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
