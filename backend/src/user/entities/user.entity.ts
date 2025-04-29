import { Licencias } from "src/licencias/entities/licencia.entity";
import { Sesion } from "src/sesion/entities/sesion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "user" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ default: false })
    activo: boolean;

    @Column()
    role: string;

    @Column({type:'float', default:0})
    horasMes:number;

    @OneToMany(()=> Sesion, (sesion) => sesion.idUsuario)
    sesiones: Sesion[];

    @OneToMany(()=>Licencias, (licencias) => licencias.user )
    licencias:Licencias[];

}
