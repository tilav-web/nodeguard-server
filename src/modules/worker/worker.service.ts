import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Worker } from "./worker.entity";
import { WorkerCreateDto } from "./dto/worker-create.dto";
import { generateWorkerKey } from "src/utils/worker-key.generate";

@Injectable()
export class WorkerService {
    constructor(
        @InjectRepository(Worker) private readonly workerRepository: Repository<Worker>,
    ) { }

    async createWorker(dto: WorkerCreateDto) {
        const worker_key = generateWorkerKey();
        const worker = this.workerRepository.create({ ...dto, worker_key })
        await this.workerRepository.save(worker);
        return `${process.env.TELEGRAM_BOT_URL}?start=unique_${worker_key}`;
    }
}