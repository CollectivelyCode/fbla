import {Global, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {APP_GUARD} from "@nestjs/core";
import {RolesGuard} from "../../guards/roles.guard";
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [UserService,{
    provide: APP_GUARD,
    useClass: RolesGuard
  }]
})
export class UserModule {}
