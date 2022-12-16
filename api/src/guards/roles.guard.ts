import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {UserRole} from "../enum/UserRole";
import {ROLES_KEY} from "../decorators/roles.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Get roles required by endpoint and the request & execution context
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        console.log(requiredRoles)
        // If endpoint doesn't have any roles, ignore
        if(!requiredRoles){
            return true
        }
        const request = context.switchToHttp().getRequest()
        // Allow other local services (NextJS Sever Side Components, local HTTP testing tools) to pass through the authorization logic
        if(request.ip == "127.0.0.1"|| "::1"){
            return true
        }
        const user = request.user
        // If user does not exist, prevent endpoint access
        if (!user) {
            return false
        }
        // If user has the required role, return true, else false
        return requiredRoles.some((role) => user.roles?.includes(role))
    }
}