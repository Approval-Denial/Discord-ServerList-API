import { PermissionsBitField, ChannelType } from 'discord.js';

export interface Guild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    description: string | null;
    region: string;
    createdAt: Date;
    createdTimestamp: number;
    memberCount: number;
    owner: GuildOwner;
    members: GuildMember[];
    roles: GuildRole[];
    channels: GuildChannel[];
    emojis: GuildEmoji[];
    sticker: GuildSticker[];
    bans: GuildBan[];
    invites: GuildInvite[];
    boost: GuildBoost;
}

export interface GuildOwner {
    id: string;
    username: string | undefined;
    displayAvatar: string | undefined;
    avatar: string | null | undefined;
    banner: string | null | undefined;
    roles: GuildRole[] | undefined;
}
export interface User {
    name: string;
    age: string | null;
}
export interface Gender {
    sex: string | null;
    symbol: string | null;
}
export interface GuildMember {
    id: string;
    username: string;
    displayName: string;
    name: User;
    gender: Gender;
    displayAvatar: string;
    avatar: string | null;
    banner: string | null;
    joinedAt: Date | null;
    joinedTimestamp: number | null;
    createAt: Date;
    createdTimestamp: number;
    roles: GuildRole[];
    permissions: Readonly<PermissionsBitField> | number;
    voice: GuildVoice;
}

export interface GuildRole {
    id: string;
    name: string;
    color: number;
    position: number;
    permissions: Readonly<PermissionsBitField> | number;
}

export interface GuildChannel {
    id: string;
    name: string;
    type: ChannelType;
    position: number;
    permissions: Readonly<PermissionsBitField> | null;
}

export interface GuildEmoji {
    id: string;
    name: string;
    animated: boolean;
    url: string;
    createdAt: Date;
    createdTimestamp: number;
}

export interface GuildSticker {
    id: string;
    name: string;
    type: string;
    format: string;
    available: boolean;
    createdAt: Date;
    url: string;
    createdTimestamp: number;
}

export interface GuildBan {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    banner: string | null;
    createdAt: Date;
    createdTimestamp: number;
}

export interface GuildInvite {
    code: string;
    channelId: string | null;
    channelName: string | null | undefined;
    maxAge: number | null;
    maxUses: number | null;
    uses: number | null;
    createdAt: Date | null;
    createdTimestamp: number | null;
}

export interface GuildBoost {
    boostCount: number | null;
    boostTier: number | null;
    boostRole: GuildRole | null;
    boosters: GuildBooster[];
}

export interface GuildBooster {
    id: string;
    name: string;
    displayAvatar: string;
    avatar: string | null;
    banner: string | null;
}

export interface GuildVoice {
    channelId: string | null;
    channelName: string | null;
    channelPosition: number | null;
    channelPermissions: Readonly<PermissionsBitField> | null;
    channelMembers: GuildVoiceMember[] | null;
}

export interface GuildVoiceMember {
    id: string;
    name: string;
    displayAvatar: string;
    avatar: string | null;
    banner: string | null;
}