import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt'
import config from "src/config"; 
import { PassportStrategy } from '@nestjs/passport'; // PassportStrategy de NestJS

import { Token } from "../models/token.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(jwtStrategy,"jwt"){
    constructor(
       @Inject(config.KEY) configService: ConfigType<typeof config>
    ){  
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwtSecret ?? 'JWT_SECRET'
        });
    }

    async validate(token: Token){
        return token;
    }
}