import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './envs/envs';
import { MailerModule } from './mailer/mailer.module';
import { CodigoActivacionModule } from './codigo-activacion/codigo-activacion.module';

@Module({
  imports: [UsuarioModule, AuthModule, MongooseModule.forRoot(
    `mongodb://${envs.DB_USERNAME}:${envs.DB_PASSWORD}@${envs.DB_HOST}:${envs.DB_PORT}/${envs.DB_NAME}?authSource=admin`,
  ), MailerModule, CodigoActivacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
