import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stories } from 'src/typeorm/entities/Stories';
import { Users } from 'src/typeorm/entities/Users';
import { SearchController } from "./search.controller";
import { SearchService } from './search.service';

@Module({
    imports: [TypeOrmModule.forFeature([Stories, Users])],
    controllers: [SearchController],
    providers: [SearchService]
})
export class SearchModule {}