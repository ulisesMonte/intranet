import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { UpdateLicenciaDto } from './dto/update-licencia.dto';
import { Licencias } from './entities/licencia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LicenciasService {

  constructor(@InjectRepository(Licencias)
      private readonly licenciasRepo: Repository<Licencias>,
      private readonly userService: UserService
    ) {}

  async create(createLicenciaDto: CreateLicenciaDto) {
    const userLicencia = await this.userService.findOne(createLicenciaDto.idUser)
    const newLicencia = {...createLicenciaDto,user:userLicencia}
    const licenciasAnteriores = await this.licenciasRepo.find({where:{
      user:userLicencia
    }});
    
  const fechaNueva = new Date(createLicenciaDto.fechaLicencia); // Fecha ingresada

  // Función para obtener la fecha solo con día, mes y año (sin hora)
  const getFechaSinHora = (fecha: Date) => {
    const newFecha = new Date(fecha);
    newFecha.setHours(0, 0, 0, 0); // Establece las horas a 00:00 para que solo compare día, mes, año
    return newFecha;
  };

  // Iterar a través de las licencias anteriores y verificar si existe una en la misma fecha
  for (const licencia of licenciasAnteriores) {
    const fechaExistente = new Date(licencia.fechaLicencia); // Fecha de la licencia existente

    // Si las fechas son iguales (día, mes, año)
    if (getFechaSinHora(fechaNueva).getTime() === getFechaSinHora(fechaExistente).getTime()) {
      throw new ConflictException('Ya existe una licencia para esta fecha.');
   }
  }const licenciaModel = this.licenciasRepo.create(newLicencia)
    return this.licenciasRepo.save(licenciaModel)
  }

  async getLicencias(userId:number){
    const userData = await this.userService.findOne(userId)
    const licencias = await this.licenciasRepo.find({where:{
      user:userData
    }})
    return licencias
  }

  async getfechaLicencia(idUser:number){
    const userF = await this.userService.findOne(idUser)
    const licenciasUser = await this.licenciasRepo.findOne({where:{
      user:userF
    }})
    if(!licenciasUser)return null
    return licenciasUser.fechaLicencia
  }
  async findAll() {
    return await this.licenciasRepo.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} licencia`;
  }

  update(id: number, updateLicenciaDto: UpdateLicenciaDto) {
    return `This action updates a #${id} licencia`;
  }

  remove(id: number) {
    return `This action removes a #${id} licencia`;
  }
}
