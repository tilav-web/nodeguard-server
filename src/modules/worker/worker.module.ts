import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Worker } from "./worker.entity";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Worker]),
    ],
    controllers: [WorkerController],
    providers: [WorkerService],
})
export class WorkerModule { }