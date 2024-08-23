import { Controller, Post } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/usuario/dto/login-dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ActivacionDTO } from './activacion.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @MessagePattern('login') // Ruta para obtener todas las configuraciones registradas
  public async login(loginDTO: LoginDTO) {
    try {
      return await this.authService.login(loginDTO)
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('registrer')
  public async registrer(userDTO: CreateUsuarioDto) {
    try {
      await this.authService.registrer(userDTO)
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('cambiarContrasena')
  public async cambiarContrasena(payload: { idUsuario: string, newContrasena: string, contrasenaAnterior?: string }) {
    try {
      await this.authService.cambiarContrasena(payload.idUsuario, payload.newContrasena, payload.contrasenaAnterior)
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('enviarCodigoVerificacionIdentidad')
  public async enviarCodigoVerificacionIdentidad(idUsuario: string) {
    try {
      await this.authService.enviarCorreoVerificacionIdentidad(idUsuario)
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('verificarCodigoIdentidad')
  public async verificarCodigoIdentidad(activacionDTO: ActivacionDTO) {
    try {
      await this.authService.verificarCodigoIdentidad(activacionDTO.idUsuario, activacionDTO.codigoActivacion)
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('activarCuentaUsuario')
  public async activarCuentaUsuario(activacionDTO: ActivacionDTO) {
    try {
      await this.authService.activarCuentaUsuario(activacionDTO.idUsuario, activacionDTO.codigoActivacion)
      return { success: true }
    } catch (error) {
      console.log(error)
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }
}
