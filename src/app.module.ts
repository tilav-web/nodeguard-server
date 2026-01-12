import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Yangi importlar
import { BotModule } from './modules/bot/bot.module';
import { UserModule } from './modules/user/user.module';
import { WorkerModule } from './modules/worker/worker.module';
import { SocketModule } from './modules/socket/socket.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'), // <-- Muammo shu yerda hal bo'ladi
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Mantiqni soddalashtirdik
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    BotModule,
    UserModule,
    WorkerModule,
    SocketModule,
    RedisModule
  ],
})
export class AppModule { }
