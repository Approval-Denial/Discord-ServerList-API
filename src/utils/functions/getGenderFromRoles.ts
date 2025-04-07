import { genderWords } from '../genderWords';
import { Role } from 'discord.js';

export function getGenderFromRoles(roles: Role[]): { gender: string | null, symbol: string | null } {
    for (const role of roles) {
        for (const genderWord of genderWords) {
            if (genderWord.genderNames.some((name) => role.name.toLowerCase().includes(name.toLowerCase()))) {
                return { gender: genderWord.gender, symbol: genderWord.symbol };
            }
        }
    }
    return { gender: null, symbol: null }; 
}