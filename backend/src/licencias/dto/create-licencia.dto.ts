import { IsDate, IsDateString, IsNotEmpty } from "class-validator";

export class CreateLicenciaDto {


    @IsNotEmpty()
    idUser:number;

    @IsNotEmpty()
    @IsDateString()
    fechaLicencia:Date;

    @IsNotEmpty()
    razonLicencia:string;
}
