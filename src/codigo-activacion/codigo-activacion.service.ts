import { Injectable } from '@nestjs/common';
import { CreateCodigoActivacionDTO } from './dto/create-codigo-activacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CodigoActivacion } from './schemas/codigo-activacion.schema';
import { Model } from 'mongoose';
import { FiltersCodigoActivacionDTO } from './dto/filters-codigo-activacion.dt';

@Injectable()
export class CodigoActivacionService {
    constructor(@InjectModel(CodigoActivacion.name) private codigoActivacionModel: Model<CodigoActivacion>) { }

    public async createCodigoActivacion(codigoActivacionDTO: CreateCodigoActivacionDTO) {
        const codigoActivacion = new this.codigoActivacionModel(codigoActivacionDTO) // se crea un codigo de activacion  basado en la información del codigo de activacion dto

        // se inserta el codigo de activación en la base de datos
        await codigoActivacion.save()
    }

    public async findOne(idCodigoActivacion?: string, idUsuario?: string, codigoActivacion?: string) {
        const filters: FiltersCodigoActivacionDTO = new FiltersCodigoActivacionDTO(idCodigoActivacion, idUsuario, codigoActivacion)
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]); // se eliminan los valores undefined de los filtros

        return await this.codigoActivacionModel.findOne(filters).exec()
    }

    public async deleteCodigoActivacion(idCodigoActivacion: string) {
        await this.codigoActivacionModel.deleteOne({ _id: idCodigoActivacion }).exec()
    }

}
