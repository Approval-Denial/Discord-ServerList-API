import { Client, Events, GuildEmoji } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildEmojiUpdate,
    once: true,
  execute(client: Client, discordService: DiscordService, oldEmoji: any, newEmoji: any,) {
        discordService.guildUpdateEmoji(oldEmoji.guild.id, newEmoji.id,);
    },
} 