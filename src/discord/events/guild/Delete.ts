import { Client, Guild,Events } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildDelete,
    once: true,
    execute(client: Client, discordService: DiscordService, guild: Guild) {
        console.log(`Bot is ready! Logged in as ${client.user?.tag}`);
        discordService.removeGuild(guild.id);
        discordService.setVoiceRanking();
    },
}