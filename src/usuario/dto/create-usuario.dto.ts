import { RolEnum } from "../entities/usuario.schema"

export class CreateUsuarioDto {
    nombreUsuario: string
    contrasena: string
    email: string
    rol?: RolEnum
    isActiva?: boolean
}
