import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async createToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async decodeToken(token: string): Promise<any> {
        return this.jwtService.decode(token);
    }
} 