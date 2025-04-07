import { Client, Events, GuildMember } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildMemberUpdate,
    execute(client: Client, discordService: DiscordService, oldMember: GuildMember, newMember: GuildMember,) {
        if (oldMember.premiumSince && !newMember.premiumSince) {
            discordService.guildRemoveBoost(newMember.guild.id, newMember.id);
        }
    },
};