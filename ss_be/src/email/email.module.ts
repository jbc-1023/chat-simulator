import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stories } from 'src/typeorm/entities/Stories';
import { Users } from 'src/typeorm/entities/Users';
import { EmailController } from "./email.controller";
import { EmailService } from './email.service';

@Module({
    imports: [TypeOrmModule.forFeature([Stories, Users])],
    controllers: [EmailController],
    providers: [EmailService]
})
export class EmailModule {}