import { Client, Events, Guild, VoiceState } from 'discord.js';
import { DiscordService } from '../../discord.service';

export default {
    name: Events.VoiceStateUpdate,
    once: true,
    execute(client: Client, discordService: DiscordService, oldState: VoiceState, newState: VoiceState) {
        if (oldState.channelId === newState.channelId) return;
        discordService.setVoiceRanking();
    },
} 