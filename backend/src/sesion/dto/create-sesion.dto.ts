import { IsAlpha, IsBoolean, isDateString, IsDateString, isNotEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSesionDto {


    @IsNotEmpty()
    @IsString()
    nombreSesion: string;

    @IsNotEmpty()
    @IsNumber()
    idUsuario:Number;
    
    @IsNotEmpty()
    @IsDateString()
    fechaFin:Date;


}
