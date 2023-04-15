import {JwtModule} from "@nestjs/jwt";
import {Global, Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env["JWT_SECRET"],
            signOptions: {expiresIn: "3660s"}
        })
    ],
    exports: [JwtModule]
})
export class JwtGlobalModule {}