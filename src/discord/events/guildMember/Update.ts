import { Client, Guild,Events, GuildMember } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildMemberUpdate,
    once: true,
    execute(client: Client, discordService: DiscordService, guild: Guild,oldMember:GuildMember,newMember:GuildMember) {
        discordService.guildMemberUpdate(guild.id, newMember.id);
    },
}