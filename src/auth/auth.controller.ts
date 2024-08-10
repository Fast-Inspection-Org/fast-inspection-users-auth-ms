import { Controller } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/usuario/dto/login-dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';

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
}
