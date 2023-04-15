import {AuthService} from "./auth.service";
import {
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Response,
    ClassSerializerInterceptor,
    UseInterceptors,
    Body, Req, Res, HttpCode
} from "@nestjs/common";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {UserService} from "../resources/user/user.service";
import {SignupDto} from "./dto/signup.dto";
import {Response as ResponseType} from "express"
import {ApiOkResponse} from "@nestjs/swagger";
import {Public} from "../decorators/public.decorator";
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService){}
    @UseGuards(LocalAuthGuard)
    @ApiOkResponse()
    @Public()
    @HttpCode(200)
    @Post("login")
    async login(@Req() req, @Res({passthrough: true}) res: ResponseType){
        const login_data = await this.authService.login(req.user)
        res.cookie("auth_token", login_data.auth_token)
        return login_data
    }
    @Public()
    @Post("signup")
    async signUp(@Body() signupDto: SignupDto, @Req() req: Request){
        await this.authService.signUp(signupDto.password, signupDto.username, signupDto.accountType, signupDto.studentData, signupDto.signUpCode )
    }
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("profile")
    async profile(@Req() req){
        return await this.userService.findOneByUsername(req.user.username)
    }


}