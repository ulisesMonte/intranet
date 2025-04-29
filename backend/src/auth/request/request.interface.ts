
import { Request } from "express";
import { User } from "src/user/entities/user.entity";

export interface RequestHelp extends  Request {
    user?: User;  // Aquí agregamos la propiedad 'user' al tipo 'Request'
  }