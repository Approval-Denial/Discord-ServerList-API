import { Client, Events, Channel } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.ChannelUpdate,
    once: true,
  execute(client: Client, discordService: DiscordService, oldChannel: Channel, newChannel: Channel) {
        if (newChannel.isDMBased()) return;
        discordService.guildChannelUpdate(newChannel.guildId, newChannel.id);
    },
} 