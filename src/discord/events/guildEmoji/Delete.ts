import { Client, Events, GuildEmoji } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildEmojiDelete,
    execute(client: Client, discordService: DiscordService, emoji: GuildEmoji) {
       discordService.guildRemoveEmoji(emoji.guild.id, emoji.id);
    },
} 