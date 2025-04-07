import { Client, Events } from 'discord.js';
import { DiscordService } from '../discord.service';

export default {
    name: Events.Error,
    execute(client: Client, error: Error, discordService: DiscordService) {
        console.error('Discord.js hatası:', error);

        // Hata loglama ve bildirim gönderme işlemleri buraya eklenebilir
        // Örneğin: Discord webhook'a hata bildirimi gönderme
        // veya veritabanına hata kaydı ekleme
    },
} 