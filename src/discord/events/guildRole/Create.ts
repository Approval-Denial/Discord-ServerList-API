import { Client, Events, Role } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildRoleCreate,
    execute(client: Client, discordService: DiscordService, role: Role) {
        discordService.guildAddRole(role.guild.id, role.id);
    },
} 