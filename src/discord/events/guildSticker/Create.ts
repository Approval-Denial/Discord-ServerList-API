import { Client, Events, Sticker } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildStickerCreate,
    execute(client: Client, discordService: DiscordService, sticker: Sticker) {
        if(!sticker.guild) return;
        discordService.guildAddSticker(sticker.guild.id, sticker.id);

    },
} 