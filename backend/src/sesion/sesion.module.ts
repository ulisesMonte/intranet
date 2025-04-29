import { Module } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './entities/sesion.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Licencias } from 'src/licencias/entities/licencia.entity';
import { LicenciasModule } from 'src/licencias/licencias.module';
import { LicenciasService } from 'src/licencias/licencias.service';
import { EmailsService } from 'src/emails/emails.service';
import { EmailsModule } from 'src/emails/emails.module';
@Module({
  imports: [TypeOrmModule.forFeature([Sesion, User,Licencias]), UserModule,LicenciasModule,EmailsModule],
  controllers: [SesionController],
  providers: [SesionService,UserService,LicenciasService,EmailsService],
  exports:[SesionService],
})
export class SesionModule {}
