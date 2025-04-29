import { IsString,IsEmail, IsNotEmpty, } from "class-validator";




export class CreateUserDto {

    @IsString()
    @IsEmail()
    readonly email:string;
    
    @IsString()
    @IsNotEmpty()
    readonly name:string;

    
    @IsString()
    @IsNotEmpty()
    readonly password:string;
}
