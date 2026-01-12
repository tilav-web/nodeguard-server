import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { BullModule } from "@nestjs/bullmq";

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: 'auth-sessions',
        }),
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }