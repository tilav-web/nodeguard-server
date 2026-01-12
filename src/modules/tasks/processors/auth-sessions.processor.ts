import { Processor } from "@nestjs/bullmq";

@Processor('auth-sessions')
export class AuthSessionsProcessor {
    // Task processor methods will be implemented here
}