import { Client, Events, Invite } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.InviteDelete,
    execute(client: Client, discordService: DiscordService, invite: Invite) {
        if (!invite.guild) return;
        discordService.guildRemoveInvite(invite.guild.id, invite.code);
    },
} 