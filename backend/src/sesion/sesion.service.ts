import { Injectable } from '@nestjs/common';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Sesion } from './entities/sesion.entity';
import { UserService } from 'src/user/user.service';
import { cerrarSesionDto } from './dto/cerrar-sesion.dto';
import { LicenciasService } from 'src/licencias/licencias.service';
import { EmailsService } from 'src/emails/emails.service';
@Injectable()
export class SesionService {

  constructor(
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
    private readonly userService: UserService,
    private readonly licenciasService: LicenciasService,
    private readonly emailService : EmailsService
  ) {}

  async create(createSesionDto: CreateSesionDto) {
    const idUser = Number(createSesionDto.idUsuario)
    const user = await this.userService.findOne(idUser)
    if(!user){
      throw new Error("El usuario no existe, porfavor agrega un usuario existente")
    }
    const fechaActual = new Date()
    const licenciasUser = await this.licenciasService.getfechaLicencia(user.id)
    if(licenciasUser?.getDay() == fechaActual.getDay()){
      throw new Error('no puede crear una actividad si tiene licencia')
    }
    const sesion = {...createSesionDto, idUsuario:user,activa:true}
    const sesionesAntiguas = await this.findSesionesUser(idUser)
    const sesionActiva =sesionesAntiguas.find(sesion => sesion.activa)
    if(sesionActiva){
      throw new Error("cierra la sesion anterior")
    }
    
    const newSesion = this.sesionRepo.create(sesion);
    newSesion.fechaInicio = new Date()
    console.log(newSesion)
    await this.userService.updateEstado(idUser)
    await this.sesionRepo.save(newSesion)
    return this.emailService.sendUserConfirmation(user.name,user.email)
  }

  async findAll() {
    return await this.sesionRepo.find();
  }

  async findOne(id: number) {
    return await this.sesionRepo.findOne({where:{id}});
  }


  
  async getHorasMes(userId:number){

    const fechaActual = new Date();
    const inicioDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);

    const user = await  this.userService.findOne(userId)
    const sesionesDelMes = await this.sesionRepo.find({
      where: {
        idUsuario: user,
        fechaInicio: MoreThanOrEqual(inicioDelMes),  // Solo sesiones después del primer día del mes
        fechaFin: MoreThanOrEqual(inicioDelMes),     // Sesiones que tienen fecha de fin también dentro del mes
      },
    });

    let horasTotales = 0;
    sesionesDelMes.forEach(sesion =>{
      horasTotales += sesion.horas.valueOf()
    })
    user.horasMes = horasTotales;
    await this.userService.update(user.id,user)
    return horasTotales;
  }

  async findSesionesUser(idUser:number){
    const id = Number(idUser)
    const user = await this.userService.findOne(id)
    const sesionesUser = await this.sesionRepo.find({ 
      where: { idUsuario: user }
    }) 
    return sesionesUser;
  }

  async getFechaFin(idUser:String){
    const id = Number(idUser)
    const user = await this.userService.findOne(id)
    const sesionUser = await this.sesionRepo.findOne({ 
      where: { idUsuario: user,
        activa:true }
    })
    if(sesionUser?.fechaFin){
      let fechaFin = new Date(sesionUser.fechaFin);
      fechaFin.setHours(fechaFin.getHours()- 3)
      return fechaFin
    }else{
      return null
    }
  }

  async endSesion(cerrarSesionDto:cerrarSesionDto ){
    const idUser = Number(cerrarSesionDto.idUsuario)
    const user = await this.userService.findOne(idUser)
    const sesion = await this.sesionRepo.findOne({ where: { idUsuario: user,
      activa:true
    }})
    if(!sesion) throw new Error("inicia una sesion antes de finalizarla")

    sesion.activa = false;
    const dateInicio =  new Date(cerrarSesionDto.fechaInicio).getTime()
    if(!sesion.fechaFin) throw new Error("no hay fecha fin")
    const updateUser = {...user,activo:false}
    await this.userService.update(user.id,updateUser)
    const dateFin = new Date(sesion.fechaFin).getTime()
    const ms =  dateFin - dateInicio;
    const horasDeSesion = ms/ (1000*60*60)
    const horasSesion = cerrarSesionDto.horas
    const updateSesion = {...sesion, fechaInicio: cerrarSesionDto.fechaInicio, horas:horasSesion}
    const updateBd = await this.sesionRepo.merge(sesion,updateSesion)
    this.sesionRepo.save(updateBd)
    return this.emailService.sendCloseUserConfirmation(user.name,user.email,horasSesion)

  }

  async remove(id: number) {
    return await this.sesionRepo.delete(id)
  }
}
