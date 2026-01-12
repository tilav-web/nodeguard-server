import { Body, Controller, Post } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { WorkerCreateDto } from "./dto/worker-create.dto";

@Controller('workers')
export class WorkerController {
    constructor(
        private readonly workerService: WorkerService,
    ) { }

    @Post('create')
    async createWorker(
        @Body() dto: WorkerCreateDto
    ) {
        return this.workerService.createWorker(dto);
    }
}