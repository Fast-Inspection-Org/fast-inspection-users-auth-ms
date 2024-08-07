
import { RolEnum } from '../entities/usuario.schema';

export class UpdateUsuarioDto {
    nombreUsuario: string
    contrasena: string
    rol: RolEnum
}
