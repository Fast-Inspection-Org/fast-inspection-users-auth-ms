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
  imports: [
    UsuarioModule,
    AuthModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`,
    ),
    MailerModule,
    CodigoActivacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
