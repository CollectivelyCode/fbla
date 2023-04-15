import {CallHandler, ClassSerializerInterceptor, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable, tap} from "rxjs";
import {map} from "rxjs/operators"
import {RequestWithUser} from "../types/RequestWithUser";
import {User} from "../resources/user/entities/user.entity";
interface PlainLiteralObject {
    [key: string]: any;
}
@Injectable()
export class RoleClassSerializer extends ClassSerializerInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const contextOptions =  this.getContextOptions(context);
        const options = {
            ...this.defaultOptions,
            ...contextOptions,
        }

        let user: User
        return next.handle().pipe(tap(() => {
            const req = context.switchToHttp().getRequest<RequestWithUser>()
            user = req.user
        })).pipe(map((res: PlainLiteralObject | Array<PlainLiteralObject>) => {
            this.serialize(res, {
                groups: user.roles,
                ...options
            })
        })).pipe()
    }
}

