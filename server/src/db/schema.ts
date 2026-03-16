import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const rarityEnum = ["3-STAR", "4-STAR", "5-STAR"] as const;
export const archetypeEnum = ["GENERATION", "MANIPULATION", "CONVERSION", "SUPPORT", "DIVA"] as const;
export const factionEnum = ["CELESTIAL", "ECLIPSE", "AURORA", "ZENITH", "SOLSTICE"] as const;

// New Enum for directional support logic
export const directionEnum = ["LEFT", "RIGHT", "BOTH", "NONE"] as const;

export const cards = sqliteTable("cards", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    image: text("image").notNull(),
    rarity: text("rarity", { enum: rarityEnum }).notNull(),
    archetype: text("archetype", { enum: archetypeEnum }).notNull(),
    faction: text("faction", { enum: factionEnum }).notNull(),

    // --- Disjointed Stat Columns ---
    // Generation: Multiplies idle Gold [cite: 18]
    goldMultiplier: real("gold_multiplier").default(1.0),

    // Manipulation: Increases specific pull rates [cite: 19]
    pullRateBoost: real("pull_rate_boost"),

    // Conversion: Ratio for resource trading [cite: 20]
    conversionRatio: real("conversion_ratio"),

    // Support: Directional buff logic [cite: 21, 58]
    buffValue: real("buff_value"),
    buffDirection: text("buff_direction", { enum: directionEnum }).default("NONE"),

    // Diva: Prestige/Flex score [cite: 22]
    prestigePoints: integer("prestige_points").default(0),
});

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),

    // Core Resources [cite: 5]
    gold: text("gold").notNull().default("0"), // [cite: 6]
    celestialWishes: integer("celestial_wishes").notNull().default(0), // [cite: 8]
    starGems: integer("star_gems").notNull().default(0), // [cite: 8]

    lastLoginAt: integer("last_login_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    isChallengeMode: integer("is_challenge_mode", { mode: "boolean" }).default(false), // [cite: 38]
    deckLockedUntil: integer("deck_locked_until", { mode: "timestamp" }), // [cite: 12, 59]
});

export const userCards = sqliteTable("user_cards", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    cardId: integer("card_id").notNull().references(() => cards.id),

    level: integer("level").notNull().default(1),
    exp: integer("exp").notNull().default(0), // [cite: 7]
    eidolonLevel: integer("eidolon_level").notNull().default(0), // [cite: 29]
});

export const userDecks = sqliteTable("user_decks", {
    userId: integer("user_id").notNull().references(() => users.id),
    // Exactly 4 slots [cite: 10]
    slot1CardId: integer("slot_1_id").references(() => userCards.id),
    slot2CardId: integer("slot_2_id").references(() => userCards.id),
    slot3CardId: integer("slot_3_id").references(() => userCards.id),
    slot4CardId: integer("slot_4_id").references(() => userCards.id),
}, (table) => [
    primaryKey({ columns: [table.userId] }),
]);