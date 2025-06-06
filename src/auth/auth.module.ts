import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/globals';
import { CodigoActivacionModule } from 'src/codigo-activacion/codigo-activacion.module';
import { MailerModule } from 'src/mailer/mailer.module';


@Module({
  imports: [UsuarioModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  }), CodigoActivacionModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
