import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express"
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
     // @ts-ignore
    async canActivate(context: ExecutionContext): Promise<boolean> | Observable<boolean> {
         const request = context.switchToHttp().getRequest();
         const token = this.extractTokenFromHeader(request);
         const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
             context.getHandler(),
             context.getClass()
         ])
        if (isPublic){
            return true
        }
         if (!token) {
             throw new UnauthorizedException();
         }
         try {
             const payload = await this.jwtService.verifyAsync(
                 token,
                 {
                     secret: process.env["JWT_SECRET"]
                 }
             )
             request["user"] = payload
         } catch {
             throw new UnauthorizedException();
         }
         return true;
     }
    private extractTokenFromHeader(req: Request) {
        if (req.cookies && "auth_token" in req.cookies && req.cookies["auth_token"].length > 0){
            return req.cookies["auth_token"]
        }

    }
}