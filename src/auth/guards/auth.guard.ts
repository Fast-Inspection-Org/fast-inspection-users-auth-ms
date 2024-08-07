import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/constantes/constants';

// Guarda que verifica que el Usuario de encuentre logeado antes de acceder al controlador de la ruta
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // El primer paso es extraer el token de la request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) { // si no se pudo extraer el token
      throw new UnauthorizedException(); // se detiene la ejecución del método con la exeption lanzada
    }

    // Se realiza la comparación del token con la palabra secreta
    // El método retorna el payload asociado al token
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload; // se añade a la request el payload del token
    } catch {
      throw new UnauthorizedException(); // si la palabra secreta y el token no son iguales se detiene la ejecución del método con la exception
    }

    // Si no se produjo niguna exeption se retorna true para indicar que se le permite el acceso al controlador de ruta al usuario que realizó la petición
    return true;
  }

  //Metodo para extraer el token de la petición
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
