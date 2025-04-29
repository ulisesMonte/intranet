import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/models/roles.enum';
import { accessSync } from 'fs';
import { SesionService } from 'src/sesion/sesion.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
     private userRepo: Repository<User>,
    ){}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    console.log(newUser.password)
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    newUser.role = Role.user;
    return await this.userRepo.save(newUser);
    
  
  }


  findAll() {
    return this.userRepo.find();
  }

  async findByEmail(email:string):Promise<User>{
    const user:User|null = await this.userRepo.findOne({
      where:{email}
    })
    if(!user){
      throw new ConflictException("El usuario no existe")
    }
    console.log("Resultado findone: " + user)
    return user;
  }

  async findOne(id: number):Promise<User> {
    const user:User|null = await this.userRepo.findOne({
    where:{id}
    })  
    
    if (!user) {
      throw new Error('User not found'); // Lanzar un error si no se encuentra el usuario
    }
    return user;
  }



  async updateEstado(id:number){
    const user = await this.userRepo.findOne({ where: { id } })
    if(!user){
      throw new Error("user no exsite")
    }
    user.activo = true;
    await this.userRepo.update(id,user)
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    
    const user:User = await this.findOne(id);
    const updateUser:User = this.userRepo.merge(user,updateUserDto);  
    this.userRepo.save(updateUser)
    return updateUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
