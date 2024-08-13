import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { LoginDTO } from 'src/usuario/dto/login-dto';
import { RolEnum, Usuario } from 'src/usuario/entities/usuario.schema';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private userService: UsuarioService,
        private jwtService: JwtService
    ) { }

    // Metodo para logear un usuario en el sistema
    public async login(loginDTO: LoginDTO) {
        const userEntity = await this.userService.findOne(undefined, loginDTO.nombreUsuario) // se obtiene la usuario por su nombre de usuario
        let res: {
            token: string, payload: {
                userId: string,
                rol: RolEnum
            }
        } | undefined = undefined

        // Si fue encontrado el usuario
        if (userEntity) {
            if (await bcrypt.compare(loginDTO.contrasena, userEntity.contrasena.toString())) { // si la contraseña es correcta
                if (userEntity.rol) { // si fue asignado un rol al usuario
                    // se crea un payload esto es la información adicional que va a hacer almacenada como parte del token generado
                    const payload = { userId: userEntity._id.toString(), rol: userEntity.rol }
                    // se crea el token
                    const token = await this.jwtService.signAsync(payload) // se crea un token con la información del payload
                    res = { token: token, payload } // se retorna el token junto con el id del usuario
                }
                else
                    throw new HttpException("No se le ha asignado un rol al usuario", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
            }
            else
                throw new HttpException("La contrasena es incorrecta", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
        }
        else
            throw new HttpException("El nombre de usuario es incorrecto", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

        return res
    }

    // Metodo para registrar un usuario en el sistema
    public async registrer(userDTO: CreateUsuarioDto) {
        return await this.userService.create(userDTO) // Se manda a registrar al usuario en la base de datos al servicio de usuarios
    }

}
