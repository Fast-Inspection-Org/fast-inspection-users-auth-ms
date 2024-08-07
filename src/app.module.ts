import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './envs/envs';

@Module({
  imports: [UsuarioModule, AuthModule, MongooseModule.forRoot(`mongodb://localhost/${envs.NAME_DB}`)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
