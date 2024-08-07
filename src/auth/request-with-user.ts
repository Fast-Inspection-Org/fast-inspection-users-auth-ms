import { Request } from "express";
import { RolEnum } from "src/usuario/entities/usuario.schema";

export interface RequestWithUser extends Request {
    user: {
        userId: number,
        rol: RolEnum
    }
}