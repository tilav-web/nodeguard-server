import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Yangi importlar
import { BotModule } from './modules/bot/bot.module';
import { UserModule } from './modules/user/user.module';
import { WorkerModule } from './modules/worker/worker.module';
import { SocketModule } from './modules/socket/socket.module';
import { RedisModule } from './modules/redis/redis.module';
import { databaseConfig } from './configs/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig
    }),
    BotModule,
    UserModule,
    WorkerModule,
    SocketModule,
    RedisModule
  ],
})
export class AppModule { }
