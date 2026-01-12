import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Bot, webhookCallback } from 'grammy';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../worker/worker.entity';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private readonly bot: Bot;
  public webhookCallback?: (req: Request, res: Response) => Promise<void>;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>
  ) {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error(
        'BOT_TOKEN is not defined in your environment variables!',
      );
    }

    this.bot = new Bot(token);
    this.setupCommands();
  }

  async onModuleInit() {
    const botMode = this.configService.get<string>('BOT_MODE');

    if (botMode === 'polling') {
      console.log('Bot is starting in polling mode...');

      try {
        await this.bot.api.deleteWebhook({ drop_pending_updates: true });
        this.bot.start();
        console.log('Bot started successfully in polling mode.');
      } catch (error) {
        console.error('Error starting bot in polling mode:', error);
        throw error;
      }
    } else if (botMode === 'webhook') {
      console.log('Bot is starting in webhook mode...');

      this.webhookCallback = webhookCallback(this.bot, 'express');

      const webhookUrl = this.configService.get<string>('WEBHOOK_URL');
      if (!webhookUrl) {
        throw new Error(
          'WEBHOOK_URL is not defined in your environment variables!',
        );
      }

      try {
        await this.bot.api.setWebhook(webhookUrl, {
          drop_pending_updates: true,
        });
        console.log(`Telegram bot webhook successfully set to: ${webhookUrl}`);
      } catch (error) {
        console.error('Error setting webhook:', error);
        throw error;
      }
    } else {
      throw new Error(
        'Invalid BOT_MODE. Please set it to "polling" or "webhook" in your .env file.',
      );
    }
  }

  private setupCommands() {
    this.bot.command('start', async (ctx) => {
      try {
        const telegram_id = ctx.from?.id;
        const first_name = ctx.from?.first_name || undefined;
        const last_name = ctx.from?.last_name || undefined;
        const username = ctx.from?.username || undefined;
        const startParam = ctx.match
          ? ctx.match.toString().trim()
          : null;


        if (!telegram_id) {
          await ctx.reply("Xatolik yuz berdi: Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qaytadan /start yuboring. Nodeguard dan olingan url bilan!");
          return;
        }

        let user = await this.userRepository.findOne({ where: { telegram_id } });

        if (startParam && startParam.startsWith('unique_')) {
          const worker_key = startParam.slice('unique_'.length);

          if (!worker_key && worker_key.length === 0) {
            await ctx.reply("Xatolik yuz berdi: Noto'g'ri start parametri. Iltimos, qaytadan /start yuboring. Nodeguard dan olingan url bilan!");
            return;
          }

          if (user) {
            if (first_name) user.first_name = first_name;
            if (last_name) user.last_name = last_name;
            if (username) user.username = username;
          }

          if (!user) {
            user = this.userRepository.create({
              telegram_id,
              first_name,
              last_name,
              username,
            });
          }
          await this.userRepository.save(user);

          const worker = await this.workerRepository.findOne({ where: { worker_key } });

          if (!worker) {
            await ctx.reply("Xatolik yuz berdi: Noto'g'ri ishchi kaliti. Iltimos, qaytadan /start yuboring. Nodeguard dan olingan url bilan!");
            return;
          }

          worker.user = user;
          await this.workerRepository.save(worker);

          await ctx.reply(`Siz muvaffaqiyatli bogʻlandingiz! Endi siz bildirishnomalarni olasiz. server: ${worker.os_name}`);
          return;
        }

        await ctx.reply('Salom! Botga xush kelibsiz.');
      } catch (error) {
        console.error('Error handling /start command:', error);
        await ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      }
    });

    // Error handling for bot
    this.bot.catch((err) => {
      console.error('Bot error:', err);
    });
  }

  getBot(): Bot {
    return this.bot;
  }

  async onModuleDestroy() {
    const botMode = this.configService.get<string>('BOT_MODE');

    if (botMode === 'polling') {
      try {
        await this.bot.stop();
        console.log('Bot stopped polling.');
      } catch (error) {
        console.error('Error stopping bot:', error);
      }
    }
  }
}
