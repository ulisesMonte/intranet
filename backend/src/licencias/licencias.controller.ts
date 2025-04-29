import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LicenciasService } from './licencias.service';
import { CreateLicenciaDto } from './dto/create-licencia.dto';
import { UpdateLicenciaDto } from './dto/update-licencia.dto';

@Controller('licencias')
export class LicenciasController {
  constructor(private readonly licenciasService: LicenciasService) {}

  @Post()
  create(@Body() createLicenciaDto: CreateLicenciaDto) {
    return this.licenciasService.create(createLicenciaDto);
  }

  @Get()
  findAll() {
    return this.licenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licenciasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicenciaDto: UpdateLicenciaDto) {
    return this.licenciasService.update(+id, updateLicenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenciasService.remove(+id);
  }
}
