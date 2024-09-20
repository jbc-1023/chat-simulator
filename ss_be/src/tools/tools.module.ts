import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email_domains } from 'src/typeorm/entities/Email_domains';
import { Report } from 'src/typeorm/entities/Report';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { Stories } from 'src/typeorm/entities/Stories';
import { Users } from 'src/typeorm/entities/Users';

@Module({
    imports: [TypeOrmModule.forFeature([Email_domains, Report, Stories, Users])],
    controllers: [ToolsController],
    providers: [ToolsService]
})
export class ToolsModule {}