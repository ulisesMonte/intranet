import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { enviroments } from 'enviroments';
import { SesionModule } from './sesion/sesion.module';
import * as Joi from 'joi';
import { Sesion } from './sesion/entities/sesion.entity';
import { LicenciasModule } from './licencias/licencias.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailsModule } from './emails/emails.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:enviroments[process.env.NODE_ENV as keyof typeof enviroments] || ".env",
      load:[config],
      isGlobal:true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
    }),


    }),
    TypeOrmModule.forRoot({
    type:"mysql",
    host:"localhost",
    port:3310,
    username:"uli",
    password:"uliS",
    database:"autenticator",
    autoLoadEntities:true,
    synchronize:true,
    entities:[__dirname + '/../**/*.entity.ts']
  }), UserModule, AuthModule, SesionModule, LicenciasModule, EmailsModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
