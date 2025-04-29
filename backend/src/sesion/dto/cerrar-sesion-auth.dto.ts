import { IsAlpha, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class cerrarSesionDto {


    @IsNotEmpty()
    @IsString()
    nombreSesion: string;


    @IsNotEmpty()
    @IsDateString()
    fechaInicio:Date;


    @IsNotEmpty()
    @IsNumber()
    horas:number;
}
