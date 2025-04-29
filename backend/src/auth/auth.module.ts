import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigType } from '@nestjs/config';
import config from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.stratergy';
import { LocalStrategy } from './strategies/local.stratergy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { userInfo } from 'os';
import { Sesion } from 'src/sesion/entities/sesion.entity';
import { SesionModule } from 'src/sesion/sesion.module';
import { Licencias } from 'src/licencias/entities/licencia.entity';
import { LicenciasModule } from 'src/licencias/licencias.module';



@Module({
  imports:[
    UserModule,
    PassportModule,
    ConfigModule,
    SesionModule,
    LicenciasModule,
    JwtModule.registerAsync({
        imports:[ConfigModule],
        inject: [ConfigService], // Inyectamos el ConfigService
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'), // Usa el valor de JWT_SECRET desde el archivo .env
          signOptions: {
            expiresIn: '60m', // Duración del token (1 hora)
          },
        }),
      }),
    TypeOrmModule.forFeature([User, Sesion,Licencias])
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports:[AuthService]
})
export class AuthModule {}
