import { Controller } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/usuario/dto/login-dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @MessagePattern('login') // Ruta para obtener todas las configuraciones registradas
  public async login(loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO)
  }

  @MessagePattern('registrer')
  public async registrer(userDTO: CreateUsuarioDto) {
    return await this.authService.registrer(userDTO)
  }
}
