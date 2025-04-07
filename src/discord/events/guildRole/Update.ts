import { Client, Guild,Events, GuildMember, Role } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildRoleUpdate,
    once: true,
    execute(client: Client, discordService: DiscordService, role:Role) {
        discordService.guildUpdateRoles(role.guild.id, role.id);
    },
}