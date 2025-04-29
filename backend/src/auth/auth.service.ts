import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UnauthorizedException} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Token } from './models/token.interface';

@Injectable()
export class AuthService {

  constructor(
    private userService:UserService,
    private jwtService:JwtService
  ) {}


  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(`Password incorrect, please try again`);
    }
    return user;
  }
  
  generateJWT(user: User) {
    const token: Token = { role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(token),
      user,
    };
}
}