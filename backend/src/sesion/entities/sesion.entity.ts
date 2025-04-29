import { Exclude } from "class-transformer";
import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn,Column, ManyToOne, JoinColumn, OneToMany , Entity} from "typeorm";


@Entity()
export class Sesion {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombreSesion:string;


    @Column()
    activa:boolean;

    @Column()
    fechaInicio:Date;


    @Column({type:"datetime", nullable:true})
    fechaFin: Date | null;

    @Column({type:'float', default:0})
    horas:number;

    @ManyToOne(()=>User, (user) => user.sesiones)
    @JoinColumn({ name: "idUsuario" })
    idUsuario: User;

}



