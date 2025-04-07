import { Client, Events, Invite } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.InviteCreate,
    execute(client: Client, discordService: DiscordService, invite: Invite) {
        if (!invite.guild) return;
        discordService.guildAddInvite(invite.guild.id, invite.code);
    },
} 