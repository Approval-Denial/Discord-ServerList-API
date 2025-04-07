import { Client, Events, Channel } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.ChannelDelete,
    execute(client: Client, discordService: DiscordService, channel: Channel) {
        if (channel.isDMBased()) return;
        discordService.guildRemoveChannel(channel.guildId, channel.id);
    },
} 