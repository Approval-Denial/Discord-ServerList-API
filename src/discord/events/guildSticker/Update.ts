import { Client, Events, Sticker } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.GuildStickerUpdate,
    once:true,
    execute(client: Client, discordService: DiscordService, oldStickers: any, newSticker: any) {
       discordService.guildUpdateSticker(newSticker.guild.id,newSticker.id)
    },
} 