import { Client, Events, GuildMember } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildMemberUpdate,
    execute(client: Client, oldMember: GuildMember, newMember: GuildMember, discordService: DiscordService) {
        if (!oldMember.premiumSince && newMember.premiumSince) {
            discordService.guildAddBoost(newMember.guild.id, newMember.id);
        }
    },
};