import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumniModule } from './alumni/alumni.module';
import { Alumni } from './alumni/entities/alumnus.entity';

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
        Alumni
      ],

    }),
    AlumniModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
