import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { MessagePattern, RpcException } from '@nestjs/microservices';
import { FiltersUsuarioDTO } from './dto/filters-usuario.dto';


@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @MessagePattern('createUsuario')
  public async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      await this.usuarioService.create(createUsuarioDto);
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @UseInterceptors(ClassSerializerInterceptor) // se indica que se usan interceptores para personalizar la serialización del objeto de retorno del método
  @MessagePattern('getAllUsers')
  public async findAll(filtersUsuariosDTO: FiltersUsuarioDTO) {
    try {
      return await this.usuarioService.findAll(typeof filtersUsuariosDTO.nombreUsuario === 'string' ? filtersUsuariosDTO.nombreUsuario : undefined,
        filtersUsuariosDTO.rol, undefined, filtersUsuariosDTO.idSolicitante)
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('getUsuario')
  public async findOne(id: string) {
    try {
      return await this.usuarioService.findOne(id);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('updateUser')
  public async update(paylodad: { id: string, updateUsuarioDto: UpdateUsuarioDto }) {
    try {
      await this.usuarioService.update(paylodad.id, paylodad.updateUsuarioDto)
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }

  @MessagePattern('deleteUser')
  public async delete(id: string) {
    try {
      await this.usuarioService.delete(id)
      return { success: true }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status
      })
    }
  }
}
