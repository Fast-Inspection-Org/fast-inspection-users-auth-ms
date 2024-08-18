
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";


// Se define el enum de los roles de usuario

export enum RolEnum {
    SuperAdministrador = "Súper Administrador",
    Administrador = "Administrador",
    Especialista = "Especialista Ing Civil",
    EspecialistaAvz = "Especialista Ing Civil Avanzado"
}

@Schema()
export class Usuario {
    @Prop()
    nombreUsuario: String
    @Prop()
    @Exclude()
    contrasena: String
    @Prop()
    email: String
    @Prop()
    rol: RolEnum
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
