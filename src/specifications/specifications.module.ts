import {HttpCustomService} from './service/HttpCustomService';
import {EventService} from './service/event/event.service';
import {Dimension} from './../typeorm/dimension.entity';
import {Module} from '@nestjs/common';
import {SpecificationController} from './controller/specification.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DimensionService} from './service/dimension/dimension.service';
import {GenericFunction} from './service/genericFunction';
import {DatasetService} from './service/dataset/dataset.service';
import {HttpModule} from '@nestjs/axios';
import {PipelineService} from './service/pipeline/pipeline.service';
import {ScheduleService} from './service/schedule/schedule.service';
import {S3Service} from './service/s3/s3.service';
import {Grammar} from "./service/grammar/grammar.service";

@Module({
    imports: [HttpModule],
    controllers: [SpecificationController],
    providers: [DimensionService, EventService, GenericFunction, DatasetService, PipelineService, HttpCustomService, ScheduleService, S3Service, Grammar],

})
export class SpecificationsModule {
}
