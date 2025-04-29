import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { Sesion } from 'src/sesion/entities/sesion.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  exports:[UserService],
  providers: [UserService],
})
export class UserModule {}
