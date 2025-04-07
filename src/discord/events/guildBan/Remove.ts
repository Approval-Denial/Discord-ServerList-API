import { Client, Events, GuildBan } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildBanRemove,
    execute(client: Client, discordService: DiscordService, ban: GuildBan) {
        discordService.guildRemoveBan(ban.guild.id, ban.user.id);
    },
} 