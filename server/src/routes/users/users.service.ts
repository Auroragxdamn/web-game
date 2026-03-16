import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';

export const usersService = {
  getAllUsers: async () => {
    return await db.select().from(users);
  },
  getUserById: async (id: number) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },
  createUser: async (data: typeof users.$inferInsert) => {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },
  updateUser: async (id: number, data: Partial<typeof users.$inferInsert>) => {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  },
  deleteUser: async (id: number) => {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0];
  }
};
