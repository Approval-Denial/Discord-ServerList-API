import { Client, Events, Channel } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.ChannelCreate,
    execute(client: Client, discordService: DiscordService, channel: Channel) {
        if (channel.isDMBased()) return;
        discordService.guildAddChannel(channel.guildId, channel.id);
    },
} 