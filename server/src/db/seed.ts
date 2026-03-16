import { db } from "./index"; // Path to your Drizzle db instance
import { cards } from "./schema";
import { InferInsertModel } from "drizzle-orm";

type NewCard = InferInsertModel<typeof cards>;

const INITIAL_CARDS: NewCard[] = [
    {
        name: "Astraea, the First Light",
        image: "astraea.png",
        rarity: "5-STAR",
        archetype: "DIVA", // Divas are an archetype [cite: 22]
        faction: "CELESTIAL", // Divine & Holy vibes
        prestigePoints: 5000,
    },
    {
        name: "Nyx, Harbinger of Night",
        image: "nyx.png",
        rarity: "5-STAR",
        archetype: "DIVA",
        faction: "ECLIPSE", // Dark & Corrupted vibes
        prestigePoints: 5000,
    },
    {
        name: "Solara, Flame Core",
        image: "solara.png",
        rarity: "4-STAR",
        archetype: "GENERATION", // Pure economy card [cite: 18]
        faction: "SOLSTICE", // Burning & Crimson vibes
        goldMultiplier: 2.0, // 1:1 linear Gold scale [cite: 6]
    },
    {
        name: "Nebula Weaver",
        image: "nebula.png",
        rarity: "3-STAR",
        archetype: "SUPPORT", // Directional buffer [cite: 21, 58]
        faction: "AURORA", // Colorful & Cheerful vibes
        buffValue: 0.15,
        buffDirection: "RIGHT",
    }
];

async function seed() {
    console.log("🌱 Cleaning existing cards...");
    await db.delete(cards); // Optional: Clears table before seeding

    console.log("🛰️ Injecting Project Stellar initial roster...");
    await db.insert(cards).values(INITIAL_CARDS);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});