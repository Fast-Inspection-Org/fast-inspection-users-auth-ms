import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { MessagePattern } from '@nestjs/microservices';
import { FiltersUsuarioDTO } from './dto/filters-usuario.dto';


@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @MessagePattern('createUsuario')
  public async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @UseInterceptors(ClassSerializerInterceptor) // se indica que se usan interceptores para personalizar la serialización del objeto de retorno del método
  @MessagePattern('getAllUsers')
  public async findAll(filtersUsuariosDTO: FiltersUsuarioDTO) {
    // con el request luego se registra una traza de auditoria
    return await this.usuarioService.findAll(typeof filtersUsuariosDTO.nombreUsuario === 'string' ? filtersUsuariosDTO.nombreUsuario : undefined,
      filtersUsuariosDTO.rol);
  }

  @MessagePattern('getUsuario')
  public async findOne(id: number) {
    return await this.usuarioService.findOne(id);
  }

  @MessagePattern('updateUser')
  public async update(paylodad: { id: number, updateUsuarioDto: UpdateUsuarioDto }) {
    return await this.usuarioService.update(paylodad.id, paylodad.updateUsuarioDto);
  }

  @MessagePattern('deleteUser')
  public async delete(id: number) {
    return await this.usuarioService.delete(id)
  }
}
