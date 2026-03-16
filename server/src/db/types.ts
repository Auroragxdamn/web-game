import { InferSelectModel } from 'drizzle-orm';
import { cards } from './schema';

type DbCard = InferSelectModel<typeof cards>;

export const factionEnum = ["CELESTIAL", "ECLIPSE", "AURORA", "ZENITH", "SOLSTICE"] as const;
export type Faction = (typeof factionEnum)[number];

interface BaseCard {
    id: number;
    name: string;
    image: string;
    rarity: DbCard['rarity'];
    faction: Faction; // Divas now belong to one of these five 
}

export interface GenerationCard extends BaseCard {
    archetype: 'GENERATION';
    goldMultiplier: number; // 1:1 linear scale [cite: 6, 18]
}

export interface ManipulationCard extends BaseCard {
    archetype: 'MANIPULATION';
    pullRateBoost: number; // RNG control [cite: 19]
}

export interface ConversionCard extends BaseCard {
    archetype: 'CONVERSION';
    conversionRatio: number; // Resource trading [cite: 20]
}

export interface SupportCard extends BaseCard {
    archetype: 'SUPPORT';
    buffValue: number;
    buffDirection: 'LEFT' | 'RIGHT' | 'BOTH' | 'NONE'; // Directional [cite: 21, 58]
}

// Diva is now just a role/identity [cite: 22]
export interface DivaCard extends BaseCard {
    archetype: 'DIVA';
    prestigePoints: number; // Flex/Prestige value [cite: 22]
}

export type ProjectStellarCard =
    | GenerationCard
    | ManipulationCard
    | ConversionCard
    | SupportCard
    | DivaCard;