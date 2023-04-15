import {ExecutionContext, Injectable} from "@nestjs/common";
import { ExtractJwt, Strategy} from "passport-jwt"
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express"
import { JwtService } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: true,
            secretOrKey: configService.get("JWT_SECRET")
        });

    }
    private static extractJWT(req: Request): string | null{
        if (req.cookies && "auth_token" in req.cookies && req.cookies["auth_token"].length > 0){
            return req.cookies["auth_token"]
        }
        return null
    }
    async validate(payload: any){
        return { userId: payload.sub, username: payload.username, role: payload.role}
    }

}