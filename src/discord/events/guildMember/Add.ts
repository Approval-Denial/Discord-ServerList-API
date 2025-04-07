import { Client, Events, GuildMember } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildMemberAdd,
    execute(client: Client, member: GuildMember, discordService: DiscordService) {
        discordService.guildAddMember(member.guild.id, member.id);
    },
} 