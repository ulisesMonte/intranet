import { IsAlpha, IsBoolean, isDateString, IsDateString, isNotEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class sesionAuthDto {


    @IsNotEmpty()
    @IsString()
    nombreSesion: string;

    @IsNotEmpty()
    @IsDateString()
    fechaFin:Date;


}
