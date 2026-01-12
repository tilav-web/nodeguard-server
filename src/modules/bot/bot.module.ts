import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { Worker } from '../worker/worker.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Worker])],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule { }
