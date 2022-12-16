import {Injectable, NotFoundException} from '@nestjs/common';
import {UserService} from "../resources/user/user.service";
import bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private jwtService: JwtService) {}
    async validateUser(username: string, password: string): Promise<any>{
        const user = await this.usersService.findOneByUsername(username)
        if (!user){
            throw new NotFoundException()
        }
        if(await bcrypt.compare(password, user.passwordHash)){
            return true
        }
        return null
    }
    async login(user: any){
        const payload = { username: user.username, sub: user.user, role: user.role.toString()}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

}
