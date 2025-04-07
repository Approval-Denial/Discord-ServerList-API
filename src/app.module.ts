import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DiscordController } from './discord/discord.controller';
import { DiscordService } from './discord/discord.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.TTL || '60'),
      limit: parseInt(process.env.MAX_REQUESTS || '10')
    }]),
    AuthModule,
  ],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class AppModule { }
