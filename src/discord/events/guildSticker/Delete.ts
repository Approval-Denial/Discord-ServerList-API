import { Client, Events, Sticker } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildStickerDelete,
    execute(client: Client, discordService: DiscordService, sticker: Sticker,) {
        discordService.guildRemoveSticker(String(sticker.guild?.id),sticker.id)
    },
} 