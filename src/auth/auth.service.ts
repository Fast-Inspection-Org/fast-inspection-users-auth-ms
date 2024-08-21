import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { LoginDTO } from 'src/usuario/dto/login-dto';
import { RolEnum, Usuario } from 'src/usuario/entities/usuario.schema';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { CodigoActivacionService } from 'src/codigo-activacion/codigo-activacion.service';
import { envs } from 'src/envs/envs';
import { MailerService } from 'src/mailer/mailer.service';
import { SendEmailDTO } from 'src/mailer/send-email.dto';
import { codigoActivacionHTML } from 'src/plantillas/codigo-activacion-html';
import { CreateCodigoActivacionDTO } from 'src/codigo-activacion/dto/create-codigo-activacion.dto';
@Injectable()
export class AuthService {
    constructor(private userService: UsuarioService,
        private jwtService: JwtService,
        private codigoActivacionService: CodigoActivacionService,
        private mailerService: MailerService
    ) { }

    // Metodo para logear un usuario en el sistema
    public async login(loginDTO: LoginDTO) { // retorna el token o en caso de no esta activada la cuenta retorna el identificador del usuario
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
                // si ya fue activada la cuenta del usuario
                if (userEntity.isActiva) {
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
                else {
                    // se le envia al email del usuario un código de activación
                    const codigoActivacion: string = this.generarCodigoActivacion(6).toString()
                    await this.mailerService.sendEmail(new SendEmailDTO([{
                        name: userEntity.nombreUsuario.toString(),
                        address: userEntity.email.toString()
                    }], "Código de Verificación", "Le damos la Bienvenida a los Servicios de Fast-Inspection", codigoActivacionHTML(envs.NAME_APP, codigoActivacion,
                        userEntity.nombreUsuario.toString(), envs.EMAIL_APP), {
                        name: envs.NAME_APP,
                        address: envs.EMAIL_APP
                    }))
                    // además se registra el código de activación en la base de datos
                    await this.codigoActivacionService.createCodigoActivacion(new CreateCodigoActivacionDTO(userEntity._id.toString(), codigoActivacion, new Date()))
                    // se indica que el usuario debe de activar la cuenta para completar el logeo
                    return { idUsuario: userEntity._id.toString() } // se retorna el identificador del usuario para poder activar su cuenta
                }
            }
            else
                throw new HttpException("La contrasena es incorrecta", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
        }
        else
            throw new HttpException("El nombre de usuario es incorrecto", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

        return res
    }

    // Método para activar la cuenta del usuario
    public async activarCuentaUsuario(idUsuario: string, codigoActivacion: string /* representa el código de activación digitado por el usuario */) {
        // se busca al usuario por su identificador
        const usuario = await this.userService.findOne(idUsuario)

        // si fue encontrado el usuario
        if (usuario) {
            // se encuentra el código de activación del usuario
            const codigoActivacionSchema = await this.codigoActivacionService.findOne(undefined, idUsuario, codigoActivacion)
            // si fue el código de activación es correcto (o sea fue encontrado un código de activación con esos datos)
            if (codigoActivacionSchema) {
                // si el código de activación no ha expirado
                if (new Date().getTime() - codigoActivacionSchema.createAt.getTime() < parseInt(envs.EXPIRATION_TIME)) {
                    // se activa la cuenta del usuario
                    usuario.isActiva = true
                    // se actualizan los datos en la base de datos
                    await usuario.save()
                    // se elimina el codigo de activación (opcional ya que cuando se ejecute el escaneo diario cada cierto número de días serán eliminados todos los código obsoletos)
                }
                else
                    throw new HttpException("Este código de activación a expirado", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
            }
            else
                throw new HttpException("Código de Activación incorrecto", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método
        }
        else
            throw new HttpException("No existe un usuario con ese identificador", HttpStatus.BAD_REQUEST) // se lanza la exeption y se detiene la ejecución del método

    }

    // Metodo para registrar un usuario en el sistema
    public async registrer(userDTO: CreateUsuarioDto) {
        return await this.userService.create(userDTO) // Se manda a registrar al usuario en la base de datos al servicio de usuarios
    }

    // Método para generar un código de activicación de cuenta
    public generarCodigoActivacion(length: number): String {
        // Genera un código aleatorio en formato hexadecimal y lo recorta al tamaño deseado
        return randomBytes(length).toString('hex').slice(0, length);
    }

}
