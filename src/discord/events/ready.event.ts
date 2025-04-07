import { Client, Guild,Events } from 'discord.js';
import { DiscordService } from '../discord.service';
import logger from 'src/utils/logger';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client, discordService: DiscordService) {
        logger(`Client is ready! Logged in as ${client.user?.tag}`,"info","Discord");
        discordService.setGuilds();
        discordService.setVoiceRanking();
    },
}