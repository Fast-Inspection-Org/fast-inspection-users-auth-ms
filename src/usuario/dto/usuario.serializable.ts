import { RolEnum } from '../entities/usuario.schema';

export class UsuarioSerializable {
  id: string;
  nombreUsuario: String;
  email: String;
  rol: RolEnum;
  isActiva: boolean;

  constructor(
    id: string,
    nombreUsuario: String,
    email: String,
    rol: RolEnum,
    isActiva: boolean,
  ) {
    this.id = id;
    this.nombreUsuario = nombreUsuario;
    this.email = email;
    this.rol = rol;
    this.isActiva = isActiva;
  }
}
