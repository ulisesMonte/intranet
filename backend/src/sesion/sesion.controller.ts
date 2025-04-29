import { Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { SesionService } from './sesion.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { cerrarSesionDto } from './dto/cerrar-sesion.dto';
import { number } from 'joi';

@Controller('sesion')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  @Post()
  create(@Body() createSesionDto: CreateSesionDto) {
    return this.sesionService.create(createSesionDto);
  }


  @Put()
  finSesion(@Body() cerrarSesionDto: cerrarSesionDto) {
    return this.sesionService.endSesion(cerrarSesionDto);
  }

  
  @Get('getHoras/:id')
  getHoras(@Param('id') id: string) {
    const idUser = Number(id)
    return  this.sesionService.getHorasMes(idUser)
  }

  @Get()
  findAll() {
    return this.sesionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sesionService.findOne(+id);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sesionService.remove(+id);
  }

}


