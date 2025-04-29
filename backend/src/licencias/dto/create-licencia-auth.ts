import { IsDate, IsDateString, IsNotEmpty } from "class-validator";

export class CreateLicenciaAuthDto {


    @IsNotEmpty()
    @IsDateString()
    fechaLicencia:Date;

    @IsNotEmpty()
    razonLicencia:string;
}
