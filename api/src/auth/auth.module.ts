import {Global, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../resources/user/user.module";
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import {JwtModule, JwtService} from '@nestjs/jwt';
import {AuthController} from "./auth.controller";
import {JwtStrategy} from "./jwt.strategy";
import {UserService} from "../resources/user/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "../resources/student/entities/student.entity";
import {User} from "../resources/user/entities/user.entity";
import {StudentService} from "../resources/student/student.service";
import {AdminAuthCode} from "./entities/admin-auth-code.entity";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";
import {JwtGlobalModule} from "./JwtGlobal.module";
@Global()
@Module({
  imports: [PassportModule.register({
    session: false,
  }), TypeOrmModule.forFeature([User, Student, AdminAuthCode]), JwtGlobalModule],
  providers: [AuthService, UserService, StudentService, LocalStrategy, JwtStrategy, JwtService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
