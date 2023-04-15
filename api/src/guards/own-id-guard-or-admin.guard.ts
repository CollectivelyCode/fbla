import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {User} from "../resources/user/entities/user.entity";
import {UserService} from "../resources/user/user.service";
import {Reflector} from "@nestjs/core";
import {RequestWithUser} from "../types/RequestWithUser";
import {UserRole} from "../enum/UserRole";

@Injectable()
export class OwnIdGuardOrAdmin implements CanActivate {
    constructor(private userService: UserService, private reflector: Reflector) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: RequestWithUser = context.switchToHttp().getRequest()
        const {requireOwnId, allowAdmin} = this.reflector.get<{
            requireOwnId: boolean
            allowAdmin: boolean
        }>("requireOwnId", context.getHandler())
        if (!requireOwnId){
            return true
        }
        const user: User = await this.userService.findOneByUsername(req.user.username)
        if (allowAdmin && user.roles?.includes(UserRole.ADMIN)){
            return true
        }
        if (req.params["id"] == user?.student.id.toString()){
            return true
        }
        return false
    }
}