import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Login } from 'src/typeorm/entities/Login';
import { LoginController, RegisterController } from './login.controller';
import { LoginService } from "./login.service";

@Module({
    imports: [TypeOrmModule.forFeature([Login])],
    controllers: [LoginController, RegisterController],
    providers: [LoginService]
})
export class LoginModule {}