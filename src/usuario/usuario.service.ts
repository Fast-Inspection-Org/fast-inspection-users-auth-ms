import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RolEnum, Usuario } from './entities/usuario.schema';

import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FiltersUsuarioDTO } from './dto/filters-usuario.dto';
@Injectable()
export class UsuarioService {
  constructor(@InjectModel(Usuario.name) private usuariosModel: Model<Usuario>) { }

  public async create(createUsuarioDto: CreateUsuarioDto) {
    // se encripta la contraseña
    createUsuarioDto.contrasena = await bcrypt.hash(createUsuarioDto.contrasena, 10)
    const usuario = new this.usuariosModel(createUsuarioDto) // se crea un usuario  basado en la información del usuario dto
    // se verifica que no exista un usuario con el mismo nombre o email

    if (await this.findOne(undefined, undefined, undefined, createUsuarioDto.email)) // se existe un usuario con el mismo email
      throw new HttpException("Ya este email tiene asociado una cuenta", HttpStatus.BAD_REQUEST)
    if (await this.findOne(undefined, createUsuarioDto.nombreUsuario))
      throw new HttpException("Ya el nombre usuario está siendo usado", HttpStatus.BAD_REQUEST)

    return await usuario.save() // se almacena al usuario en la base de datos
  }

  public async findAll(nombre?: String, rol?: RolEnum, email?: String): Promise<Array<Usuario>> {
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los usuarios
    const filters: FiltersUsuarioDTO = new FiltersUsuarioDTO(undefined, { $regex: nombre.toString(), $options: 'i' }, email, rol)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    return await this.usuariosModel.find(filters).exec();
  }

  public async findOne(id: number, nombre?: String, rol?: RolEnum, email?: String): Promise<Usuario> {
    // Construir el objeto de filtro dinámicamente y eliminar propiedades undefined
    // se construyen los filtros de los usuarios
    const filters: FiltersUsuarioDTO = new FiltersUsuarioDTO(id, { $regex: nombre.toString(), $options: 'i' }, email, rol)
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

    return await this.usuariosModel.findOne(filters).exec()
  }

  // Método para actualizar la información de un usuario
  public async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.usuariosModel.updateOne({ id: id }, updateUsuarioDto).exec()
  }

  // Método para eliminar un usuario en específico
  public async delete(id: number) {
    await this.usuariosModel.deleteOne({ id: id }).exec()
  }
}
