import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, GatewayIntentBits, ClientOptions, Partials, ActivityType, ChannelType } from 'discord.js';
import * as path from 'path';
import { Guild } from 'src/types/Guild';
import { getGenderFromRoles } from 'src/utils/functions/getGenderFromRoles';
import { getAllFiles } from 'src/utils/functions/gettAllFiles';
import logger from 'src/utils/logger';
const memberBanner = (banner: string | null | undefined): string | null => {
    return banner === undefined ? null : banner;
};
@Injectable()
export class DiscordService implements OnModuleInit {
    private client: Client;
    private guilds: Guild[] = [];
    private guildsLength: number = 0;
    private voiceRanking: { guildId: string, voiceRanking: any, voiceLength: number }[] = [];
    private voiceRankingLength: number = 0;

    constructor() {
        const clientOptions: ClientOptions = {
            partials: Object.keys(Partials).map((key) => Partials[key as keyof typeof Partials]),
            intents: Object.keys(GatewayIntentBits).map((key) => GatewayIntentBits[key as keyof typeof GatewayIntentBits]),
            shards: 'auto',
            allowedMentions: {
                parse: ['users', 'roles'],
                repliedUser: true,
            },
            closeTimeout: 10000,
            presence: {
                activities: [
                    {
                        name: 'Gelecek ile',
                        type: ActivityType.Playing,
                    },
                ],
                status: 'online',
            }
        };
        this.client = new Client(clientOptions);
    }

    async onModuleInit() {

        const eventsPath = path.join(__dirname, 'events');
        const eventFiles = getAllFiles(eventsPath).filter((file) => file.endsWith('.js'));

        eventFiles.forEach((file) => {
            const { default: event } = require(file);
            if (event) {
                const eventName = event.name;
                const eventOnce = event.once || false;
                if (eventOnce) {
                    this.client.once(eventName, (...args) => event.execute(this.client, this, ...args));
                } else {
                    this.client.on(eventName, (...args) => event.execute(this.client, this, ...args));
                }
                logger(`Event ${eventName} loaded from ${file}`,"info","Discord");
            }
        });
        
        this.client.on('error', (error) => logger(`WebSocket error: ${error}`, "error", "Discord"));
        this.client.on('warn', (warning) => logger(`WebSocket warning: ${warning}`, "warn", "Discord"));
        this.client.on('debug', (info) => logger(`WebSocket debug: ${info}`, "debug", "Discord"));
        this.client.on('shardError', (error) => logger(`Shard error: ${error}`, "error", "Discord"));
        this.client.on('shardReconnecting', (id) =>logger(`Shard ${id} reconnecting`, "warn", "Discord"));
        this.client.on('shardDisconnect', (event, id) => {
            logger(`Shard ${id} disconnected with code ${event.code} and reason: ${event.reason}`,'warn',"Discord");
            if (event.code === 4004) {
               logger('Invalid token. Please check your bot token.', 'error', 'Discord');
            } else if (event.code === 4014) {
                logger('Missing access. Please check your bot permissions.', 'error', 'Discord');
            } else if (event.code === 1006) {
                logger('Unknown error. Please check your bot status.', 'error', 'Discord');
            }
        });
        
        await this.client.login(process.env.DcBotToken);
    }

    setGuilds() {
        this.guilds = this.client.guilds.cache.map((g) => {
            return {
                id: g.id,
                name: g.name,
                icon: g.iconURL(),
                banner: g.bannerURL(),
                description: g.description,
                region: g.preferredLocale,
                createdAt: g.createdAt,
                createdTimestamp: g.createdTimestamp,
                memberCount: g.memberCount,
                owner: {
                    id: g.ownerId,
                    username: g.members.cache.get(g.ownerId)?.user.username,
                    displayAvatar: g.members.cache.get(g.ownerId)?.user.displayAvatarURL(),
                    avatar: g.members.cache.get(g.ownerId)?.user.avatarURL(),
                    banner: g.members.cache.get(g.ownerId)?.user.bannerURL(),
                    roles: g.members.cache.get(g.ownerId)?.roles.cache.map((r) => {
                        return {
                            id: r.id,
                            name: r.name,
                            color: r.color,
                            position: r.position,
                            permissions: r.permissions,
                        }
                    })
                },
                members: g.members.cache.filter((m) => !m.user.bot).sort((a, b) => (b?.joinedTimestamp ?? 0) - (a?.joinedTimestamp ?? 0)).map((m) => {
                    const { gender, symbol } = getGenderFromRoles(m.roles.cache.map(r => r));
                    return {
                        id: m.id,
                        banner: memberBanner(m.user.bannerURL()),
                        username: m.user.username,
                        displayName: m.displayName,
                        name: {
                            name: m.displayName.includes("|") ? m.displayName.split('|')[0] : m.displayName.includes("'") ? m.displayName.split("'")[0] : m.displayName,
                            age: m.displayName.split('|') ? m.displayName.split('|')[1] : m.displayName.includes("'") ? m.displayName.split("'")[1] : null,
                        },
                        gender: {
                            sex: gender,
                            symbol: symbol,
                        },
                        displayAvatar: m.user.displayAvatarURL(),
                        avatar: m.user.avatarURL(),
                        joinedAt: m.joinedAt,
                        joinedTimestamp: m.joinedTimestamp,
                        createAt: m.user.createdAt,
                        createdTimestamp: m.user.createdTimestamp,
                        roles: m.roles.cache.filter(r => r.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition).map((r) => {
                            return {
                                id: r.id,
                                name: r.name,
                                color: r.color,
                                position: r.position,
                                permissions: r.permissions,
                            }
                        }),
                        permissions: m.permissions,
                        voice: {
                            channelId: m.voice?.channel?.id || null,
                            channelName: m.voice?.channel?.name || null,
                            channelPosition: m.voice?.channel?.position || null,
                            channelPermissions: m.voice?.channel?.permissionsFor(m.id || '') || null,
                            channelMembers: m.voice?.channel?.members?.map((m) => {
                                return {
                                    id: m.id,
                                    name: m.user.username,
                                    displayAvatar: m.user.displayAvatarURL(),
                                    avatar: m.user.avatarURL(),
                                    banner: m.user.bannerURL() || null,
                                }
                            }) || null,
                        }
                    }
                }),


                roles: g.roles.cache.filter(r => r.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition).map((r) => {
                    return {
                        id: r.id,
                        name: r.name,
                        color: r.color,
                        position: r.position,
                        permissions: r.permissions,
                    }
                }),
                channels: g.channels.cache.filter(c => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice).sort((a, b) => b.rawPosition - a.rawPosition).map((c) => {
                    return {
                        id: c.id,
                        name: c.name,
                        type: c.type,
                        position: c.position,
                        permissions: c.permissionsFor(g.members.me?.id || ''),
                    }
                }),
                emojis: g.emojis.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).map((e) => {
                    return {
                        id: e.id,
                        name: e.name || '',  // Convert null to empty string
                        animated: e.animated || false,  // Convert null to false
                        url: e.imageURL({ size: 1024 }),
                        createdAt: e.createdAt,
                        createdTimestamp: e.createdTimestamp,
                    }
                }),
                sticker: g.stickers.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).map((s) => {
                    return {
                        id: s.id,
                        name: s.name,
                        type: s.type ? s.type.toString() : '', // Convert type to string and handle null
                        format: s.format.toString(), // Convert format to string
                        available: s.available || false,
                        createdAt: s.createdAt,
                        url: s.url,
                        createdTimestamp: s.createdTimestamp,
                    }
                }),
                bans: g.bans.cache.map((b) => {
                    return {
                        id: b.user.id,
                        username: b.user.username,
                        discriminator: b.user.discriminator,
                        avatar: b.user.displayAvatarURL(),
                        banner: b.user.bannerURL() ?? null,
                        createdAt: b.user.createdAt,
                        createdTimestamp: b.user.createdTimestamp,
                    }
                }),
                invites: g.invites.cache.map((i) => {
                    return {
                        code: i.code,
                        channelId: i.channelId,
                        channelName: i.channel?.name,
                        maxAge: i.maxAge,
                        maxUses: i.maxUses,
                        uses: i.uses,
                        createdAt: i.createdAt,
                        createdTimestamp: i.createdTimestamp,
                    }
                }),
                boost: {
                    boostCount: g.premiumSubscriptionCount,
                    boostTier: g.premiumTier,
                    boostRole: g.roles.premiumSubscriberRole,
                    boosters: g.members.cache.filter((m) => m.premiumSince).map((m) => {
                        return {
                            id: m.id,
                            name: m.user.username,
                            displayAvatar: m.user.displayAvatarURL(),
                            avatar: m.user.avatarURL(),
                            banner: m.user.bannerURL() ?? null,
                        }
                    })
                }
            }
        })
        logger(`Guilds loaded: ${this.guilds.length}`, "info", "Discord");
    }
    addGuild(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const newGuild = {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            banner: guild.banner,
            description: guild.description,
            region: guild.preferredLocale,
            createdAt: guild.createdAt,
            createdTimestamp: guild.createdTimestamp,
            memberCount: guild.memberCount,
            owner: {
                id: guild.ownerId,
                username: guild.members.cache.get(guild.ownerId)?.user.username,
                displayAvatar: guild.members.cache.get(guild.ownerId)?.user.displayAvatarURL(),
                avatar: guild.members.cache.get(guild.ownerId)?.user.avatar,
                banner: guild.members.cache.get(guild.ownerId)?.user.banner,
                roles: guild.members.cache.get(guild.ownerId)?.roles.cache.map(r => ({
                    id: r.id,
                    name: r.name,
                    color: r.color,
                    position: r.position,
                    permissions: r.permissions,
                })) || []
            },
            members: guild.members.cache.filter((m) => !m.user.bot).sort((a, b) => (b?.joinedTimestamp ?? 0) - (a?.joinedTimestamp ?? 0)).map((m) => {
                const { gender, symbol } = getGenderFromRoles(m.roles.cache.map(r => r));
                return {
                    id: m.id,
                    banner: memberBanner(m.user.bannerURL()),
                    username: m.user.username,
                    displayName: m.displayName,
                    name: {
                        name: m.displayName.includes("|") ? m.displayName.split('|')[0] : m.displayName.includes("'") ? m.displayName.split("'")[0] : m.displayName,
                        age: m.displayName.split('|') ? m.displayName.split('|')[1] : m.displayName.includes("'") ? m.displayName.split("'")[1] : null,
                    },
                    gender: {
                        sex: gender,
                        symbol: symbol,
                    },
                    displayAvatar: m.user.displayAvatarURL(),
                    avatar: m.user.avatarURL(),
                    joinedAt: m.joinedAt,
                    joinedTimestamp: m.joinedTimestamp,
                    createAt: m.user.createdAt,
                    createdTimestamp: m.user.createdTimestamp,
                    roles: m.roles.cache.filter(r => r.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition).map((r) => {
                        return {
                            id: r.id,
                            name: r.name,
                            color: r.color,
                            position: r.position,
                            permissions: r.permissions,
                        }
                    }),
                    permissions: m.permissions,
                    voice: {
                        channelId: m.voice?.channel?.id || null,
                        channelName: m.voice?.channel?.name || null,
                        channelPosition: m.voice?.channel?.position || null,
                        channelPermissions: m.voice?.channel?.permissionsFor(m.id || '') || null,
                        channelMembers: m.voice?.channel?.members?.map((m) => {
                            return {
                                id: m.id,
                                name: m.user.username,
                                displayAvatar: m.user.displayAvatarURL(),
                                avatar: m.user.avatarURL(),
                                banner: m.user.bannerURL() || null,
                            }
                        }) || null,
                    }
                }
            }),


            roles: guild.roles.cache.filter(r => r.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition).map((r) => {
                return {
                    id: r.id,
                    name: r.name,
                    color: r.color,
                    position: r.position,
                    permissions: r.permissions,
                }
            }),
            channels: guild.channels.cache.filter(c => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice).sort((a, b) => b.rawPosition - a.rawPosition).map((c) => {
                return {
                    id: c.id,
                    name: c.name,
                    type: c.type,
                    position: c.position,
                    permissions: c.permissionsFor(guild.members.me?.id || ''),
                }
            }),
            emojis: guild.emojis.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).map((e) => {
                return {
                    id: e.id,
                    name: e.name || '',  // Convert null to empty string
                    animated: e.animated || false,  // Convert null to false
                    url: e.imageURL({ size: 1024 }),
                    createdAt: e.createdAt,
                    createdTimestamp: e.createdTimestamp,
                }
            }),
            sticker: guild.stickers.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).map((s) => {
                return {
                    id: s.id,
                    name: s.name,
                    type: s.type ? s.type.toString() : '', // Convert type to string and handle null
                    format: s.format.toString(), // Convert format to string
                    available: s.available || false,
                    createdAt: s.createdAt,
                    url: s.url,
                    createdTimestamp: s.createdTimestamp,
                }
            }),
            bans: guild.bans.cache.map((b) => {
                return {
                    id: b.user.id,
                    username: b.user.username,
                    discriminator: b.user.discriminator,
                    avatar: b.user.displayAvatarURL(),
                    banner: b.user.bannerURL() ?? null,
                    createdAt: b.user.createdAt,
                    createdTimestamp: b.user.createdTimestamp,
                }
            }),
            invites: guild.invites.cache.map((i) => {
                return {
                    code: i.code,
                    channelId: i.channelId,
                    channelName: i.channel?.name,
                    maxAge: i.maxAge,
                    maxUses: i.maxUses,
                    uses: i.uses,
                    createdAt: i.createdAt,
                    createdTimestamp: i.createdTimestamp,
                }
            }),
            boost: {
                boostCount: guild.premiumSubscriptionCount,
                boostTier: guild.premiumTier,
                boostRole: guild.roles.premiumSubscriberRole,
                boosters: guild.members.cache.filter((m) => m.premiumSince).map((m) => {
                    return {
                        id: m.id,
                        name: m.user.username,
                        displayAvatar: m.user.displayAvatarURL(),
                        avatar: m.user.avatarURL(),
                        banner: m.user.bannerURL() ?? null,
                    }
                })
            }
        }
        this.guilds.push(newGuild);
    }
    removeGuild(guildId: string) { 
        const guildIndex = this.guilds.findIndex((g) => g.id === guildId);
        if (guildIndex === -1) return { message: 'Guild not found' };
        this.guilds.splice(guildIndex, 1);
    }
    updateGuild(guildId: string) { 
        const guildIndex = this.guilds.findIndex((g) => g.id === guildId);
        if (guildIndex === -1) return { message: 'Guild not found' };
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        this.guilds[guildIndex] = {
            ...this.guilds[guildIndex],
            name: guild.name,
            icon: guild.icon,
            banner: guild.banner,
            description: guild.description,
            region: guild.preferredLocale,
            createdAt: guild.createdAt,
            createdTimestamp: guild.createdTimestamp,
            memberCount: guild.memberCount,
        }
    }
    setGuildsLength(length: number) {
        this.guildsLength = length;
    }
    getGuilds() {
        return this.guilds;
    }
    getGuild(id: string) {
        return this.guilds.find((g) => g.id === id);
    }
    getGuildOwner(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.owner;
    }

    getGuildMembers(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.members;
    }
    getGuildMember(guildId: string, memberId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.find((m) => m.id === memberId);
        if (!member) return { message: 'Member not found' };
        return member;
    }
    guildMemberUpdate(guildId: string, memberId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };

        const member = guild.members.cache.get(memberId);
        if (!member) return { message: 'Member not found' };

        const { gender, symbol } = getGenderFromRoles(member.roles.cache.map((r) => r));
        const updatedMember = {
            id: member.id,
            banner: memberBanner(member.user.bannerURL()),
            username: member.user.username,
            displayName: member.displayName,
            name: {
                name: member.displayName.includes('|')
                    ? member.displayName.split('|')[0]
                    : member.displayName.includes("'")
                        ? member.displayName.split("'")[0]
                        : member.displayName,
                age: member.displayName.includes('|')
                    ? member.displayName.split('|')[1]
                    : member.displayName.includes("'")
                        ? member.displayName.split("'")[1]
                        : null,
            },
            gender: {
                sex: gender,
                symbol: symbol,
            },
            displayAvatar: member.user.displayAvatarURL(),
            avatar: member.user.avatarURL(),
            joinedAt: member.joinedAt,
            joinedTimestamp: member.joinedTimestamp,
            createAt: member.user.createdAt,
            createdTimestamp: member.user.createdTimestamp,
            roles: member.roles.cache
                .filter((r) => r.name !== '@everyone')
                .sort((a, b) => b.rawPosition - a.rawPosition)
                .map((r) => ({
                    id: r.id,
                    name: r.name,
                    color: r.color,
                    position: r.position,
                    permissions: r.permissions,
                })),
            permissions: member.permissions,
            voice: {
                channelId: member.voice?.channel?.id || null,
                channelName: member.voice?.channel?.name || null,
                channelPosition: member.voice?.channel?.position || null,
                channelPermissions: member.voice?.channel?.permissionsFor(member.id || '') || null,
                channelMembers: member.voice?.channel?.members?.map((m) => ({
                    id: m.id,
                    name: m.user.username,
                    displayAvatar: m.user.displayAvatarURL(),
                    avatar: m.user.avatarURL(),
                    banner: m.user.bannerURL() || null,
                })) || null,
            },
        };

        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };

        const memberIndex = guildData.members.findIndex((m) => m.id === memberId);
        if (memberIndex === -1) return { message: 'Member not found in local cache' };

        guildData.members[memberIndex] = updatedMember;
    }
    guildChannelUpdate(guildId: string, channelId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };

        const channel = guild.channels.cache.get(channelId);
        if (!channel) return { message: 'Channel not found' };

        const updatedChannel = {
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: 'position' in channel ? channel.position || 0 : 0,
            permissions: channel.permissionsFor(guild.members.me?.id || ''),
        };

        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };

        const channelIndex = guildData.channels.findIndex((c) => c.id === channelId);
        if (channelIndex === -1) return { message: 'Channel not found in local cache' };

        guildData.channels[channelIndex] = updatedChannel;
    }
    guildUpdateRoles(guildId: string, roleId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const role = guild.roles.cache.get(roleId);
        if (!role) return { message: 'Role not found' };
        const updatedRole = {
            id: role.id,
            name: role.name,
            color: role.color,
            position: role.position,
            permissions: role.permissions,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const roleIndex = guildData.roles.findIndex((r) => r.id === roleId);
        if (roleIndex === -1) return { message: 'Role not found in local cache' };
        guildData.roles[roleIndex] = updatedRole;
    }
    guildUpdateEmoji(guildId: string, emojiId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const emoji = guild.emojis.cache.get(emojiId);
        if (!emoji) return { message: 'Emoji not found' };
        const updatedEmoji = {
            id: emoji.id,
            name: emoji.name || '',  // Convert null to empty string
            animated: emoji.animated || false,  // Convert null to false
            url: emoji.imageURL({ size: 1024 }),
            createdAt: emoji.createdAt,
            createdTimestamp: emoji.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const emojiIndex = guildData.emojis.findIndex((e) => e.id === emojiId);
        if (emojiIndex === -1) return { message: 'Emoji not found in local cache' };
        guildData.emojis[emojiIndex] = updatedEmoji;
    }
    guildUpdateSticker(guildId: string, stickerId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const sticker = guild.stickers.cache.get(stickerId);
        if (!sticker) return { message: 'Sticker not found' };
        const updatedSticker = {
            id: sticker.id,
            name: sticker.name,
            type: sticker.type ? sticker.type.toString() : '', // Convert type to string and handle null
            format: sticker.format.toString(), // Convert format to string
            available: sticker.available || false,
            createdAt: sticker.createdAt,
            url: sticker.url,
            createdTimestamp: sticker.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const stickerIndex = guildData.sticker.findIndex((s) => s.id === stickerId);
        if (stickerIndex === -1) return { message: 'Sticker not found in local cache' };
        guildData.sticker[stickerIndex] = updatedSticker;
    }
    guildUpdateBan(guildId: string, userId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const ban = guild.bans.cache.get(userId);
        if (!ban) return { message: 'Ban not found' };
        const updatedBan = {
            id: ban.user.id,
            username: ban.user.username,
            discriminator: ban.user.discriminator,
            avatar: ban.user.displayAvatarURL(),
            banner: ban.user.bannerURL() ?? null,
            createdAt: ban.user.createdAt,
            createdTimestamp: ban.user.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const banIndex = guildData.bans.findIndex((b) => b.id === userId);
        if (banIndex === -1) return { message: 'Ban not found in local cache' };
        guildData.bans[banIndex] = updatedBan;
    }
    guildUpdateInvite(guildId: string, inviteCode: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const invite = guild.invites.cache.get(inviteCode);
        if (!invite) return { message: 'Invite not found' };
        const updatedInvite = {
            code: invite.code,
            channelId: invite.channelId,
            channelName: invite.channel?.name,
            maxAge: invite.maxAge,
            maxUses: invite.maxUses,
            uses: invite.uses,
            createdAt: invite.createdAt,
            createdTimestamp: invite.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const inviteIndex = guildData.invites.findIndex((i) => i.code === inviteCode);
        if (inviteIndex === -1) return { message: 'Invite not found in local cache' };
        guildData.invites[inviteIndex] = updatedInvite;
    }

    getGuildMemberPermissions(guildId: string, memberId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.find((m) => m.id === memberId);
        if (!member) return { message: 'Member not found' };
        const permissions = member.permissions;
        if (permissions === null) return { message: 'Member has no permissions' };
        return permissions;
    }

    guildAddMember(guildId: string, memberId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.cache.get(memberId);
        if (!member) return { message: 'Member not found' };
        const { gender, symbol } = getGenderFromRoles(member.roles.cache.map(r => r));
        const newMember = {
            id: member.id,
            banner: memberBanner(member.user.bannerURL()),
            username: member.user.username,
            displayName: member.displayName,
            displayAvatar: member.user.displayAvatarURL(),
            avatar: member.user.avatarURL(),
            joinedAt: member.joinedAt,
            joinedTimestamp: member.joinedTimestamp,
            createAt: member.user.createdAt,
            createdTimestamp: member.user.createdTimestamp,
            roles: member.roles.cache
                .filter((r) => r.name !== '@everyone')
                .sort((a, b) => b.rawPosition - a.rawPosition)
                .map((r) => ({
                    id: r.id,
                    name: r.name,
                    color: r.color,
                    position: r.position,
                    permissions: r.permissions,
                })),
            permissions: member.permissions,
            voice: {
                channelId: member.voice?.channel?.id || null,
                channelName: member.voice?.channel?.name || null,
                channelPosition: member.voice?.channel?.position || null,
                channelPermissions: member.voice?.channel?.permissionsFor(member.id || '') || null,
                channelMembers: member.voice?.channel?.members?.map((m) => ({
                    id: m.id,
                    name: m.user.username,
                    displayAvatar: m.user.displayAvatarURL(),
                    avatar: m.user.avatarURL(),
                    banner: m.user.bannerURL() || null,
                })) || null,
            },
            name: {
                name: member.displayName.includes('|')
                    ? member.displayName.split('|')[0]
                    : member.displayName.includes("'")
                        ? member.displayName.split("'")[0]
                        : member.displayName,
                age: member.displayName.includes('|')
                    ? member.displayName.split('|')[1]
                    : member.displayName.includes("'")
                        ? member.displayName.split("'")[1]
                        : null,
            },
            gender: {
                sex: gender,
                symbol: symbol
            }
        }
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const memberIndex = guildData.members.findIndex((m) => m.id === memberId);
        if (memberIndex !== -1) {
            guildData.members[memberIndex] = newMember;
        } else {
            guildData.members.push(newMember);
        }
    }
    guildRemoveMember(guildId: string, memberId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.members = guildData.members.filter((m) => m.id !== memberId);
    }

    guildAddRole(guildId: string, roleId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const role = guild.roles.cache.get(roleId);
        if (!role) return { message: 'Role not found' };
        const newRole = {
            id: role.id,
            name: role.name,
            color: role.color,
            position: role.position,
            permissions: role.permissions,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const roleIndex = guildData.roles.findIndex((r) => r.id === roleId);
        if (roleIndex !== -1) {
            guildData.roles[roleIndex] = newRole;
        }
        else {
            guildData.roles.push(newRole);
        }
    }
    guildRemoveRole(guildId: string, roleId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.roles = guildData.roles.filter((r) => r.id !== roleId);
    }

    guildAddChannel(guildId: string, channelId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const channel = guild.channels.cache.get(channelId);
        if (!channel) return { message: 'Channel not found' };
        const newChannel = {
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: 'position' in channel ? channel.position || 0 : 0,
            permissions: channel.permissionsFor(guild.members.me?.id || ''),
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const channelIndex = guildData.channels.findIndex((c) => c.id === channelId);
        if (channelIndex !== -1) {
            guildData.channels[channelIndex] = newChannel;
        }
        else {
            guildData.channels.push(newChannel);
        }
    }
    guildRemoveChannel(guildId: string, channelId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.channels = guildData.channels.filter((c) => c.id !== channelId);
    }

    guildAddEmoji(guildId: string, emojiId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const emoji = guild.emojis.cache.get(emojiId);
        if (!emoji) return { message: 'Emoji not found' };
        const newEmoji = {
            id: emoji.id,
            name: emoji.name || '',  // Convert null to empty string
            animated: emoji.animated || false,  // Convert null to false
            url: emoji.imageURL({ size: 1024 }),
            createdAt: emoji.createdAt,
            createdTimestamp: emoji.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const emojiIndex = guildData.emojis.findIndex((e) => e.id === emojiId);
        if (emojiIndex !== -1) {
            guildData.emojis[emojiIndex] = newEmoji;
        }
        else {
            guildData.emojis.push(newEmoji);
        }
    }
    guildRemoveEmoji(guildId: string, emojiId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.emojis = guildData.emojis.filter((e) => e.id !== emojiId);
    }
    guildAddSticker(guildId: string, stickerId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const sticker = guild.stickers.cache.get(stickerId);
        if (!sticker) return { message: 'Sticker not found' };
        const newSticker = {
            id: sticker.id,
            name: sticker.name,
            type: sticker.type ? sticker.type.toString() : '', // Convert type to string and handle null
            format: sticker.format.toString(), // Convert format to string
            available: sticker.available || false,
            createdAt: sticker.createdAt,
            url: sticker.url,
            createdTimestamp: sticker.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const stickerIndex = guildData.sticker.findIndex((s) => s.id === stickerId);
        if (stickerIndex !== -1) {
            guildData.sticker[stickerIndex] = newSticker;
        }
        else {
            guildData.sticker.push(newSticker);
        }
    }

    guildRemoveSticker(guildId: string, stickerId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.sticker = guildData.sticker.filter((s) => s.id !== stickerId);
    }
    guildAddBan(guildId: string, userId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const ban = guild.bans.cache.get(userId);
        if (!ban) return { message: 'Ban not found' };
        const newBan = {
            id: ban.user.id,
            username: ban.user.username,
            discriminator: ban.user.discriminator,
            avatar: ban.user.displayAvatarURL(),
            banner: ban.user.bannerURL() ?? null,
            createdAt: ban.user.createdAt,
            createdTimestamp: ban.user.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const banIndex = guildData.bans.findIndex((b) => b.id === userId);
        if (banIndex !== -1) {
            guildData.bans[banIndex] = newBan;
        }
        else {
            guildData.bans.push(newBan);
        }
    }
    guildRemoveBan(guildId: string, userId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.bans = guildData.bans.filter((b) => b.id !== userId);
    }
    guildAddInvite(guildId: string, inviteCode: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const invite = guild.invites.cache.get(inviteCode);
        if (!invite) return { message: 'Invite not found' };
        const newInvite = {
            code: invite.code,
            channelId: invite.channelId,
            channelName: invite.channel?.name,
            maxAge: invite.maxAge,
            maxUses: invite.maxUses,
            uses: invite.uses,
            createdAt: invite.createdAt,
            createdTimestamp: invite.createdTimestamp,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        const inviteIndex = guildData.invites.findIndex((i) => i.code === inviteCode);
        if (inviteIndex !== -1) {
            guildData.invites[inviteIndex] = newInvite;
        }
        else {
            guildData.invites.push(newInvite);
        }
    }
    guildRemoveInvite(guildId: string, inviteCode: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.invites = guildData.invites.filter((i) => i.code !== inviteCode);
    }
    guildAddBoost(guildId: string, memberId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.cache.get(memberId);
        if (!member) return { message: 'Member not found' };
        const newBoost = {
            id: member.id,
            name: member.user.username,
            displayAvatar: member.user.displayAvatarURL(),
            avatar: member.user.avatarURL(),
            banner: member.user.bannerURL() ?? null,
        };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.boost.boosters.push(newBoost);
    }
    guildRemoveBoost(guildId: string, memberId: string) {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return { message: 'Guild not found' };
        const guildData = this.guilds.find((g) => g.id === guildId);
        if (!guildData) return { message: 'Guild data not found in local cache' };
        guildData.boost.boosters = guildData.boost.boosters.filter((b) => b.id !== memberId);
    }

    getGuildMemberRoles(guildId: string, memberId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.find((m) => m.id === memberId);
        if (!member) return { message: 'Member not found' };
        const roles = member.roles
        if (roles.length === 0) return { message: 'Member has no roles' };
        return roles
    }

    getGuildMemberVoice(guildId: string, memberId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.find((m) => m.id === memberId);
        if (!member) return { message: 'Member not found' };
        const voice = member.voice
        if (voice.channelId === null) return { message: 'Member is not in a voice channel' };
        return voice
    }

    getGuildMemberBoosts(guildId: string, memberId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.members.find((m) => m.id === memberId);
        if (!member) return { message: 'Member not found' };
        const boost = guild.boost.boosters.find((b) => b.id === memberId);
        if (!boost) return { message: 'Member is not a booster' };
        return boost;
    }
    getMemberNameAndGender(memberId: string) {
        const guilds = this.guilds.filter((g) => g.members.find((m) => m.id === memberId));
        if (guilds.length === 0) return { message: 'Member not found' };
        return guilds.map((g) => {
            const member = g.members.find((m) => m.id === memberId);
            return {
                name: member?.name,
                gender: member?.gender,
                guildId: g.id,
                guildName: g.name,
            }
        })
    }

    getGuildRoles(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.roles;
    }
    getGuildRole(guildId: string, roleId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const role = guild.roles.find((r) => r.id === roleId);
        if (!role) return { message: 'Role not found' };
        return role;
    }
    getGuildChannels(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.channels;
    }
    getGuildChannel(guildId: string, channelId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const channel = guild.channels.find((c) => c.id === channelId);
        if (!channel) return { message: 'Channel not found' };
        return channel;
    }

    getGuildEmojis(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.emojis;
    }
    getGuildEmoji(guildId: string, emojiId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const emoji = guild.emojis.find((e) => e.id === emojiId);
        if (!emoji) return { message: 'Emoji not found' };
        return emoji;
    }

    getGuildStickers(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.sticker;
    }
    getGuildSticker(guildId: string, stickerId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const sticker = guild.sticker.find((s) => s.id === stickerId);
        if (!sticker) return { message: 'Sticker not found' };
        return sticker;
    }

    getGuildBans(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.bans;
    }
    getGuildBan(guildId: string, userId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const ban = guild.bans.find((b) => b.id === userId);
        if (!ban) return { message: 'Ban not found' };
        return ban;
    }

    getGuildInvites(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.invites;
    }
    getGuildInvite(guildId: string, inviteCode: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const invite = guild.invites.find((i) => i.code === inviteCode);
        if (!invite) return { message: 'Invite not found' };
        return invite;
    }

    getGuildBoosts(guildId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        return guild.boost;
    }
    getGuildBoostMember(guildId: string, memberId: string) {
        const guild = this.guilds.find((g) => g.id === guildId);
        if (!guild) return { message: 'Guild not found' };
        const member = guild.boost.boosters.find((m) => m.id === memberId);
        if (!member) return { message: 'Member not found' };
        return member;
    }

    getGuildsLength(): number {
        return this.guildsLength;
    }

    setVoiceRanking() {
        var i = 0;
        this.voiceRanking = this.client.guilds.cache.filter((g) => g.voiceStates.cache.filter(f => !f.member?.user.bot).size > 0).sort((a, b) => b.voiceStates.cache.size - a.voiceStates.cache.size).map((g) => {
            i = i + 1;
            return {
                guildId: g.id,
                guildName: g.name,
                guildIcon: g.iconURL(),
                guildBanner: g.bannerURL(),
                guildDescription: g.description,
                guildRegion: g.preferredLocale,
                guildCreatedAt: g.createdAt,
                guildCreatedTimestamp: g.createdTimestamp,
                guildMemberCount: g.memberCount,
                guildOwner: {
                    id: g.ownerId,
                    name: g.members.cache.get(g.ownerId)?.user.username,
                    displayAvatar: g.members.cache.get(g.ownerId)?.user.displayAvatarURL(),
                    avatar: g.members.cache.get(g.ownerId)?.user.avatarURL(),
                    banner: g.members.cache.get(g.ownerId)?.user.bannerURL(),
                    roles: g.members.cache.get(g.ownerId)?.roles.cache.map((r) => {
                        return {
                            id: r.id,
                            name: r.name,
                            color: r.color,
                            position: r.position,
                            permissions: r.permissions,
                        };
                    }
                    ) ?? [],
                },
                voiceStates: g.voiceStates.cache.filter(f => !f.member?.user.bot && f.guild.voiceStates.cache.filter(f => !f.member?.user.bot).size > 0).sort((a, b) => b.guild.members.cache.filter(f => f.voice?.channel?.id).size - a.guild.members.cache.filter(f => f.voice?.channel?.id).size).map((vs) => {
                    return {
                        id: vs.id,
                        name: vs.member?.user?.username ?? 'Unknown User',
                        avatar: vs.member?.user?.displayAvatarURL(),
                        roles: vs.member?.roles?.cache?.map((r) => {
                            return {
                                id: r.id,
                                name: r.name,
                                color: r.color,
                                position: r.position,
                                permissions: r.permissions,
                            };
                        }) ?? [],
                        voiceState: {
                            channelId: vs.channelId,
                            channelName: vs.channel?.name,
                            channelPosition: vs.channel?.position,
                            channelPermissions: vs.channel?.permissionsFor(vs.member?.id || ''),
                            channelMembers: vs.channel?.members?.map((m) => {
                                return {
                                    id: m.id,
                                    name: m.user.username,
                                    avatar: m.user.displayAvatarURL(),
                                    roles: m.roles.cache.map((r) => {
                                        return {
                                            id: r.id,
                                            name: r.name,
                                            color: r.color,
                                            position: r.position,
                                            permissions: r.permissions,
                                        };
                                    }),
                                };
                            }),
                        },
                    };
                }),

                voiceRanking: i,
                voiceLength: g.voiceStates.cache.filter(f => !f.member?.user.bot).size,
            };
            i;
        }
        );
        this.voiceRankingLength = this.voiceRanking.length;
        logger(`Voice ranking loaded: ${this.voiceRanking.length} guilds`, 'info',"Discord");
    }
    deleteVoiceRanking(guildId: string) {
        this.voiceRanking = this.voiceRanking.filter((g) => g.guildId !== guildId);
        this.voiceRanking = this.voiceRanking.sort((a, b) => b.voiceRanking - a.voiceRanking);
        this.voiceRankingLength = this.voiceRanking.length;
    }
    getVoiceRanking() {
        return this.voiceRanking;
    }
}