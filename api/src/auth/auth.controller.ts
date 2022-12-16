import {AuthService} from "./auth.service";
import {Controller, Get, Post, UseGuards, Request} from "@nestjs/common";
import { LocalAuthGuard } from "src/guards/local-auth.guard";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Request() req){
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async profile(@Request() req){
        return req.user
    }


}