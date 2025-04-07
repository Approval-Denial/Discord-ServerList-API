import { Client, Guild,Events } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildUpdate,
    once: true,
    execute(client: Client, discordService: DiscordService, oldGuild: Guild, newGuild: Guild) {
        const guild = newGuild || oldGuild;
        console.log(`Bot is ready! Logged in as ${client.user?.tag}`);
        discordService.updateGuild(guild.id);
    },
}