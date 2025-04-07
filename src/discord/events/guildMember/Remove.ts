import { Client, Events, GuildMember } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildMemberRemove,
    execute(client: Client, member: GuildMember, discordService: DiscordService) {
        discordService.guildRemoveMember(member.guild.id, member.id);
    },
} 