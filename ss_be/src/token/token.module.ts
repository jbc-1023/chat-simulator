import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from 'src/typeorm/entities/Token';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    controllers: [TokenController],
    providers: [TokenService]
})
export class TokenModule {}