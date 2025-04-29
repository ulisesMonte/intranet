import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Public } from './decorator/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import {RequestHelp} from "./request/request.interface"
import { Roles } from './decorator/roles.decorator';
import { Role } from './models/roles.enum';
import { Request } from 'express';
import { SesionService } from 'src/sesion/sesion.service';
import { Sesion } from 'src/sesion/entities/sesion.entity';
import { sesionAuthDto } from 'src/sesion/dto/sesion-auth.dto';
import { cerrarSesionDto } from 'src/sesion/dto/cerrar-sesion-auth.dto';
import { CreateLicenciaAuthDto } from 'src/licencias/dto/create-licencia-auth';
import { LicenciasService } from 'src/licencias/licencias.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sesionService: SesionService,
    private readonly licenciaService: LicenciasService
  ) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")  
  login(@Req() req:RequestHelp){
    const user = req.user ;
    if(!user){
      throw new Error("user is empty")
    }
    return this.authService.generateJWT(user);
  }


  @Public()
  @Post("register")
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);
    return this.authService.generateJWT(newUser);
  }

  
  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.user)
  @Get("getActividad")
  async getActivity(@Req() {user}: Request){
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user["sub"];
    const userData = await this.userService.findOne(userId);
    return { activityStatus: userData.activo ? 'Activo' : 'Inactivo' };
  }


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.user)
  @Post("addLicencia")
  async addLicencia(@Req() {user}: Request,@Body() license:CreateLicenciaAuthDto){
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user["sub"];
    const userData = await this.userService.findOne(userId);
    const licencia = {...license,idUser:userData.id}
    return await this.licenciaService.create(licencia)
  }


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.user)
  @Get("getLicencias")
  async getLicencias(@Req() {user}: Request){
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user["sub"];
  
    const licencias = await this.licenciaService.getLicencias(userId)
    return licencias
  }
  

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.user)
  @Get("getHoras")
  async getHoras(@Req() {user}: Request){
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user["sub"];
    const userData = await this.userService.findOne(userId);  
    const horas =  await this.sesionService.getHorasMes(userId)
    return {horasMes:horas}
  }


  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.user)
  @Get("getFechaFin")
  async getFechaFin(@Req() {user}: Request){
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user["sub"];
    const fin = await this.sesionService.getFechaFin(userId)
    return {fechaFin:fin}
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)  
  @Post('iniciarActividad')
  async changeActivity(@Req() {user}: Request, @Body() sesion:sesionAuthDto ) {
    if (!user) {
      throw new Error('User not found');
    }
    const userId = user["sub"];
    console.log(userId)
     // Validar si user existe
    if (!user) {
      throw new Error('User not found');
    }
    console.log(sesion)
    const newSesion = {
      ...sesion,
      idUsuario:userId,
    }
    await this.sesionService.create(newSesion)
    return { message: 'Actividad iniciada correctamente' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)  
  @Put('cerrarActividad')
  async cerrarActivity(@Req() { user }: Request,@Body() sesion:cerrarSesionDto) {  {
    if (!user) {
      throw new Error('User not found');
    }

    const userId = user["sub"];

    const userData = await this.userService.findOne(userId);
    
    const newSesion = {
      ...sesion,
      idUsuario:userId,
    
    }
    await this.sesionService.endSesion(newSesion)
    return { message: 'Actividad cerrada correctamente' };
  }
}

}
