import { Client, Events, Role } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildRoleDelete,
    execute(client: Client, discordService: DiscordService, role: Role) {
        discordService.guildRemoveRole(role.guild.id, role.id);
    },
} 