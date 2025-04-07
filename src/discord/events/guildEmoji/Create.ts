import { Client, Events, GuildEmoji } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildEmojiCreate,
    execute(client: Client,discordService: DiscordService, emoji: GuildEmoji) {
discordService.guildAddEmoji(emoji.guild.id, emoji.id);
    },
} 