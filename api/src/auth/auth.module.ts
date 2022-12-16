import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../resources/user/user.module";
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import {jwtConstants} from "./constants";
import {AuthController} from "./auth.controller";
import {JwtStrategy} from "./jwt.strategy";
import {UserService} from "../resources/user/user.service";

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {expiresIn: "60s"}
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
