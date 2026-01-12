import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkerCreateDto {
    os_type: string;
    os_name: string;
    os_version: string;
    arch: string;
}