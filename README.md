# Discord Server List API

A powerful and comprehensive Discord server listing platform built with NestJS. This API provides extensive endpoints for managing Discord servers, members, roles, and various server-related features.

## Features

- 🔐 Secure authentication system with JWT
- 🚀 Built with NestJS and TypeScript
- 📊 Rate limiting and request throttling
- 🔄 Discord.js integration
- 📝 Comprehensive API documentation
- 🛡️ Input validation and data transformation
- 🧪 Test coverage with Jest

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Discord Bot Token

### Installation

1. Clone the repository
```bash
git clone https://github.com/Approval-Denial/Discord-ServerList-API.git
cd discord-server-list-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory and add:
```env
PORT=3001
DISCORD_TOKEN=your_discord_bot_token
JWT_SECRET=your_jwt_secret
MAX_REQUESTS=10
TTL=60

```

4. Start the development server
```bash
npm run start:dev
```

## API Endpoints

### Guild (Server) Endpoints

#### Get All Guilds
```
GET /api/discord/guilds
```

#### Get Specific Guild
```
GET /api/discord/guilds/:id
```

#### Get Guild Owner
```
GET /api/discord/guilds/:id/owner
```

#### Get Guild Members
```
GET /api/discord/guilds/:id/members
```

#### Get Specific Member
```
GET /api/discord/guilds/:id/members/:userId
```

#### Get Member Roles
```
GET /api/discord/guilds/:id/members/:userId/roles
```

#### Get Member Voice Status
```
GET /api/discord/guilds/:id/members/:userId/voice
```

#### Get Member Boost Status
```
GET /api/discord/guilds/:id/members/:userId/boost
```

### Role Management

#### Get Guild Roles
```
GET /api/discord/guilds/:id/roles
```

#### Get Specific Role
```
GET /api/discord/guilds/:id/roles/:roleId
```

### Channel Management

#### Get Guild Channels
```
GET /api/discord/guilds/:id/channels
```

#### Get Specific Channel
```
GET /api/discord/guilds/:id/channels/:channelId
```

### Emoji & Sticker Management

#### Get Guild Emojis
```
GET /api/discord/guilds/:id/emojis
```

#### Get Specific Emoji
```
GET /api/discord/guilds/:id/emojis/:emojiId
```

#### Get Guild Stickers
```
GET /api/discord/guilds/:id/stickers
```

#### Get Specific Sticker
```
GET /api/discord/guilds/:id/stickers/:stickerId
```

### Ban Management

#### Get Guild Bans
```
GET /api/discord/guilds/:id/bans
```

#### Get Specific Ban
```
GET /api/discord/guilds/:id/bans/:userId
```

### Invite Management

#### Get Guild Invites
```
GET /api/discord/guilds/:id/invites
```

#### Get Specific Invite
```
GET /api/discord/guilds/:id/invites/:inviteCode
```

### Boost Management

#### Get Guild Boosts
```
GET /api/discord/guilds/:id/boosts
```

#### Get Specific Boost
```
GET /api/discord/guilds/:id/boosts/:userId
```

### Member Information

#### Get Member Name and Gender
```
GET /api/discord/members/:userId/nameandgender
```

### Statistics

#### Get Total Guilds Count
```
GET /api/discord/guilds-length
```

#### Get Voice Channel Rankings
```
GET /api/discord/voice-ranking
```

## Development

### Running Tests
```bash
npm run test
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

### License Summary

- This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
- This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
- See the [LICENSE](LICENSE) file for the full license text.

### Key Points of GPL-3.0

- You must provide the source code when distributing the software
- Any modifications must also be licensed under GPL-3.0
- You must include the license and copyright notice
- You must state significant changes made to the code
- The software comes with no warranty

## Support

[![Discord Banner](https://api.weblutions.com/discord/invite/luppux/)](https://discord.gg/luppux)