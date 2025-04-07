import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('token')
    async createToken(@Body() payload: any) {
        return {
            access_token: await this.authService.createToken(payload),
        };
    }

    @Get('verify')
    async verifyToken(@Headers('authorization') token: string) {
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        return this.authService.verifyToken(token.replace('Bearer ', ''));
    }
} 