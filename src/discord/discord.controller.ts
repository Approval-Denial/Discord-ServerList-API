import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { get } from 'http';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/discord')
export class DiscordController {
    constructor(private readonly discordService: DiscordService) { }

    @Get('guilds')
    @UseGuards(AuthGuard)
    getGuilds(): object {
        return {
            guilds: this.discordService.getGuilds(),
        };
    }
    @Get('guilds/:id')
    @UseGuards(AuthGuard)
    getGuild(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        return guild ? { guild } : { message: 'Guild not found' };
    }

    @Get('guilds/:id/members')
    @UseGuards(AuthGuard)
    getGuildMembers(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            members: this.discordService.getGuildMembers(guildId),
        };
    }

    @Get('guilds/:id/members/:userId/roles')
    @UseGuards(AuthGuard)
    getGuildMemberRoles(@Param() params: any): object { 
        const guildId = params.id;
        const userId = params.userId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const member = this.discordService.getGuildMember(guildId, userId);
        if (!member) {
            return { message: 'Member not found' };
        }
        return {
            roles: this.discordService.getGuildMemberRoles(guildId, userId),
        };
    }

    @Get('guilds/:id/members/:userId/voice')
    @UseGuards(AuthGuard)
    getGuildMemberVoice(@Param() params: any): object { 
        const guildId = params.id;
        const userId = params.userId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const member = this.discordService.getGuildMember(guildId, userId);
        if (!member) {
            return { message: 'Member not found' };
        }
        return {
            voice: this.discordService.getGuildMemberVoice(guildId, userId),
        };
    }

    @Get('guilds/:id/members/:userId/boost')
    @UseGuards(AuthGuard)
    getGuildMemberBoost(@Param() params: any): object { 
        const guildId = params.id;
        const userId = params.userId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const member = this.discordService.getGuildMember(guildId, userId);
        if (!member) {
            return { message: 'Member not found' };
        }
        return {
            boost: this.discordService.getGuildMemberBoosts(guildId, userId),
        };
    }

    @Get('members/:userId/nameandgender')
    @UseGuards(AuthGuard)
    getMemberNameAndGender(@Param() params: any): object { 
        const userId = params.userId;
        const member = this.discordService.getMemberNameAndGender(userId);
        if (!member) {
            return { message: 'Member not found' };
        }
        return member;
    }

    @Get('guilds/:id/members/:userId')
    @UseGuards(AuthGuard)
    getGuildMember(@Param() params: any): object {
        const guildId = params.id;
        const userId = params.userId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const member = this.discordService.getGuildMember(guildId, userId);
        return member;
    }
    
    @Get('guilds/:id/owner')
    @UseGuards(AuthGuard)
    getGuildOwner(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            owner: this.discordService.getGuildOwner(guildId),
        };
    }

    @Get('guilds/:id/roles')
    @UseGuards(AuthGuard)
    getGuildRoles(@Param() params: any): object { 
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            roles: this.discordService.getGuildRoles(guildId),
        };
    }
    @Get('guilds/:id/roles/:roleId')
    @UseGuards(AuthGuard)
    getGuildRole(@Param() params: any): object {
        const guildId = params.id;
        const roleId = params.roleId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const role = this.discordService.getGuildRole(guildId, roleId);
        return role;
    }
    @Get('guilds/:id/channels')
    @UseGuards(AuthGuard)
    getGuildChannels(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            channels: this.discordService.getGuildChannels(guildId),
        };
    }
    @Get('guilds/:id/channels/:channelId')
    @UseGuards(AuthGuard)
    getGuildChannel(@Param() params: any): object {
        const guildId = params.id;
        const channelId = params.channelId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const channel = this.discordService.getGuildChannel(guildId, channelId);
        return channel;
    }
    @Get('guilds/:id/emojis')
    @UseGuards(AuthGuard)
    getGuildEmojis(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            emojis: this.discordService.getGuildEmojis(guildId),
        };
    }
    @Get('guilds/:id/emojis/:emojiId')
    @UseGuards(AuthGuard)
    getGuildEmoji(@Param() params: any): object {
        const guildId = params.id;
        const emojiId = params.emojiId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const emoji = this.discordService.getGuildEmoji(guildId, emojiId);
        return emoji;
    }
    @Get('guilds/:id/stickers')
    @UseGuards(AuthGuard)
    getGuildStickers(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            stickers: this.discordService.getGuildStickers(guildId),
        };
    }
    @Get('guilds/:id/stickers/:stickerId')
    @UseGuards(AuthGuard)
    getGuildSticker(@Param() params: any): object {
        const guildId = params.id;
        const stickerId = params.stickerId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const sticker = this.discordService.getGuildSticker(guildId, stickerId);
        return sticker;
    }
    @Get('guilds/:id/bans')
    @UseGuards(AuthGuard)
    getGuildBans(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            bans: this.discordService.getGuildBans(guildId),
        };
    }
    @Get('guilds/:id/bans/:userId')
    @UseGuards(AuthGuard)
    getGuildBan(@Param() params: any): object {
        const guildId = params.id;
        const userId = params.userId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const ban = this.discordService.getGuildBan(guildId, userId);
        return ban;
    }
    @Get('guilds/:id/invites')
    @UseGuards(AuthGuard)
    getGuildInvites(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            invites: this.discordService.getGuildInvites(guildId),
        };
    }
    @Get('guilds/:id/invites/:inviteCode')
    @UseGuards(AuthGuard)
    getGuildInvite(@Param() params: any): object {
        const guildId = params.id;
        const inviteCode = params.inviteCode;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const invite = this.discordService.getGuildInvite(guildId, inviteCode);
        return invite;
    }
    @Get('guilds/:id/boosts')
    @UseGuards(AuthGuard)
    getGuildBoosts(@Param() params: any): object {
        const guildId = params.id;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        return {
            boosts: this.discordService.getGuildBoosts(guildId),
        };
    }
    @Get('guilds/:id/boosts/:userId')
    @UseGuards(AuthGuard)
    getGuildBoost(@Param() params: any): object {
        const guildId = params.id;
        const userId = params.userId;
        const guild = this.discordService.getGuild(guildId);
        if (!guild) {
            return { message: 'Guild not found' };
        }
        const boost = this.discordService.getGuildBoostMember(guildId, userId);
        return boost;
    }




    @Get('guilds-length')
    @UseGuards(AuthGuard)
    getGuildsLength(): object {
        return {
            guildsLength: this.discordService.getGuildsLength(),
        };
    }

    @Get('voice-ranking')
    @UseGuards(AuthGuard)
    getVoiceRanking(): object {
        return {
            voiceRanking: this.discordService.getVoiceRanking(),
        };
    }
}
