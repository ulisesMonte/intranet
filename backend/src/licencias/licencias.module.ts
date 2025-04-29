import { Module } from '@nestjs/common';
import { LicenciasService } from './licencias.service';
import { LicenciasController } from './licencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Licencias } from './entities/licencia.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[TypeOrmModule.forFeature([User,Licencias])],
  controllers: [LicenciasController],
  providers: [LicenciasService,UserService],
  exports:[LicenciasService]
})
export class LicenciasModule {}
