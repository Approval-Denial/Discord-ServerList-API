import { Client, Events, GuildBan } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildBanAdd,
    execute(client: Client, discordService: DiscordService, ban: GuildBan) {
        discordService.guildAddBan(ban.guild.id, ban.user.id);
    },
} 