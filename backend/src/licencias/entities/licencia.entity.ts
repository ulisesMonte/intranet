import { StringSchema } from "joi";
import { Sesion } from "src/sesion/entities/sesion.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "licencias" })
export class Licencias {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(()=>User, (user) => user.sesiones)
    @JoinColumn({ name: "idUsuario" })
    user:User;

    @Column()
    fechaLicencia:Date;

    @Column()
    razonLicencia:string;

}
