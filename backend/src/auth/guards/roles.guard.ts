import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../models/roles.enum";
import { ROLES_KEY } from "../decorator/roles.decorator";
import { Token } from "../models/token.interface";
import { isatty } from "tty";





@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector) {}
    canActivate(context: ExecutionContext)
    : boolean | Promise<boolean> | Observable<boolean> {
        const roles:Role[] = this.reflector.get(ROLES_KEY,context.getHandler());
        if(!roles){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user as Token;
        const isAuth = roles.some((role)=>role === user.role)
        if(!isAuth){
            throw new UnauthorizedException(
                'Access denied: insufficient permissions',
            );
        }
        return isAuth;
    
    }


}