import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {UserRole} from "../enum/UserRole";
import {ROLES_KEY} from "../decorators/roles.decorator";
import {HttpArgumentsHost} from "@nestjs/common/interfaces";
import {Request} from "express";
import {User} from "../resources/user/entities/user.entity";
import {RequestWithUser} from "../types/RequestWithUser";
import {UserService} from "../resources/user/user.service";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private userService: UserService, private reflector: Reflector) {}
    async canActivate(executionContext: ExecutionContext): Promise<boolean> {
        // Get roles required by endpoint and the request & execution context
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            executionContext.getHandler(),
            executionContext.getClass()
        ])
        // If endpoint doesn't have any roles, ignore
        if(!requiredRoles){
            return true
        }
        const httpContext: HttpArgumentsHost = executionContext.switchToHttp()
        const req = httpContext.getRequest<RequestWithUser>()
        // Allow other local services (NextJS Sever Side Components, local HTTP testing tools) to pass through the authorization logic (only if they desire)
        if((req.ip == "127.0.0.1"|| req.ip == "::1") && req.get("X-Local-Passthrough") != "ignore" ){
            return true
        }
        const user: User = await this.userService.findOneByUsername(req.user.username)
        // If user does not exist, prevent endpoint access
        if (!user) {
            return false
        }
        // If user has the required role, return true, else false
        return requiredRoles.some((role) => user.roles?.includes(role))
    }
}