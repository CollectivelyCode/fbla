import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../resources/user/user.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from "@nestjs/typeorm";
import {StudentService} from "../resources/student/student.service";
import {AdminAuthCode} from "./entities/admin-auth-code.entity";
import {Repository} from "typeorm";
import {UserRole} from "../enum/UserRole";
import * as process from "process";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private studentService: StudentService, private jwtService: JwtService, @InjectRepository(AdminAuthCode) private authCodeRepository: Repository<AdminAuthCode>) {}
    async validateUser(username: string, password: string): Promise<any>{
        const user = await this.userService.findOneByUsername(username)
        if (!user){
            throw new NotFoundException()
        }
        if(await bcrypt.compare(password, user.passwordHash)){
            return user
        }
        return null
    }
    async signUp(password: string, username: string, accountType: "admin"|"student", studentOptions?: StudentOptions, adminAuthCode?: string){
        if (accountType === "student" && !studentOptions){
            throw new BadRequestException("Student options parameter required to create student account")
        }
        if (accountType === "admin" && !adminAuthCode){
            throw new BadRequestException("Admin signup code required to create admin account")
        }
        let authCode = null
        if (accountType === "admin"){
            authCode = await this.authCodeRepository.findOneBy({authCode: adminAuthCode})
            if (!authCode || authCode.revoked || authCode.used){
                throw new UnauthorizedException("Auth code not valid or has been user or revoked")
            }
        }

        if (await this.userService.findOneByUsername(username)){
            throw new BadRequestException("Username already taken")
        }

        const user = await this.userService.create({
            username: username,
            passwordHash: await bcrypt.hash(password, 10),
            roles: accountType === "admin" ? [UserRole.ADMIN] : [UserRole.STUDENT]
        })
        if (accountType === "student"){
            await this.studentService.create({
                user: user,
                ...studentOptions
            })
        }
        if (authCode){
            authCode.used = true
            await this.authCodeRepository.save(authCode)
        }
        return user
    }
    async login(user: any){
        const payload = { username: user.username, sub: user.userId, role: user.role}
        return {
            auth_token: this.jwtService.sign(payload, {
                secret: process.env["JWT_SECRET"]
            }),
            user: user
        }
    }
}
export type StudentOptions = {
    grade: 9|10|11|12,
    name: string
}