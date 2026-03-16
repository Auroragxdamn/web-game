import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { userCards } from '../../db/schema';

export const userCardsService = {
  getAllUserCards: async () => {
    return await db.select().from(userCards);
  },
  getUserCardsByUserId: async (userId: number) => {
    return await db.select().from(userCards).where(eq(userCards.userId, userId));
  },
  createUserCard: async (data: typeof userCards.$inferInsert) => {
    const result = await db.insert(userCards).values(data).returning();
    return result[0];
  },
  updateUserCard: async (id: number, data: Partial<typeof userCards.$inferInsert>) => {
    const result = await db.update(userCards).set(data).where(eq(userCards.id, id)).returning();
    return result[0];
  },
  deleteUserCard: async (id: number) => {
    const result = await db.delete(userCards).where(eq(userCards.id, id)).returning();
    return result[0];
  }
};
