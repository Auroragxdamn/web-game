import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { cards } from '../../db/schema';

export const cardsService = {
  getAllCards: async () => {
    return await db.select().from(cards);
  },
  getCardById: async (id: number) => {
    const result = await db.select().from(cards).where(eq(cards.id, id));
    return result[0];
  },
  createCard: async (data: typeof cards.$inferInsert) => {
    const result = await db.insert(cards).values(data).returning();
    return result[0];
  },
  updateCard: async (id: number, data: Partial<typeof cards.$inferInsert>) => {
    const result = await db.update(cards).set(data).where(eq(cards.id, id)).returning();
    return result[0];
  },
  deleteCard: async (id: number) => {
    const result = await db.delete(cards).where(eq(cards.id, id)).returning();
    return result[0];
  }
};
