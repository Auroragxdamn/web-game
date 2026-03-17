import { Elysia, t } from "elysia";

export type CardRarity = "3-STAR" | "4-STAR" | "5-STAR";
export type CardArchetype = "GENERATION" | "MANIPULATION" | "CONVERSION" | "SUPPORT" | "DIVA";
export type CardFaction = "CELESTIAL" | "ECLIPSE" | "AURORA" | "ZENITH" | "SOLSTICE";
export type CardBuffDirection = "LEFT" | "RIGHT" | "BOTH" | "NONE";

export type UserRecord = {
  id: number;
  email: string;
  username: string;
  password: string;
  gold: string;
  celestialWishes: number;
  starGems: number;
  lastLoginAt: Date | null;
  isChallengeMode: boolean | null;
  deckLockedUntil: Date | null;
};

export type UserInsert = {
  email: string;
  username: string;
  password: string;
};

export type UserUpdate = Partial<UserInsert>;

export type CardRecord = {
  id: number;
  name: string;
  image: string;
  rarity: CardRarity;
  archetype: CardArchetype;
  faction: CardFaction;
  goldMultiplier: number | null;
  pullRateBoost: number | null;
  conversionRatio: number | null;
  buffValue: number | null;
  buffDirection: CardBuffDirection | null;
  prestigePoints: number | null;
};

export type CardInsert = {
  name: string;
  image: string;
  rarity: CardRarity;
  archetype: CardArchetype;
  faction: CardFaction;
  goldMultiplier?: number;
  pullRateBoost?: number;
  conversionRatio?: number;
  buffValue?: number;
  buffDirection?: CardBuffDirection;
  prestigePoints?: number;
};

export type CardUpdate = Partial<CardInsert>;

export type UserCardRecord = {
  id: number;
  userId: number;
  cardId: number;
  level: number;
  exp: number;
  eidolonLevel: number;
};

export type UserCardInsert = {
  userId: number;
  cardId: number;
  level?: number;
  exp?: number;
  eidolonLevel?: number;
};

export type UserCardUpdate = Partial<Pick<UserCardInsert, "level" | "exp" | "eidolonLevel">>;

export interface UsersService {
  getAllUsers: () => Promise<UserRecord[]>;
  getUserById: (id: number) => Promise<UserRecord | undefined>;
  createUser: (data: UserInsert) => Promise<UserRecord | undefined>;
  updateUser: (id: number, data: UserUpdate) => Promise<UserRecord | undefined>;
  deleteUser: (id: number) => Promise<UserRecord | undefined>;
}

export interface CardsService {
  getAllCards: () => Promise<CardRecord[]>;
  getCardById: (id: number) => Promise<CardRecord | undefined>;
  createCard: (data: CardInsert) => Promise<CardRecord | undefined>;
  updateCard: (id: number, data: CardUpdate) => Promise<CardRecord | undefined>;
  deleteCard: (id: number) => Promise<CardRecord | undefined>;
}

export interface UserCardsService {
  getAllUserCards: () => Promise<UserCardRecord[]>;
  getUserCardsByUserId: (userId: number) => Promise<UserCardRecord[]>;
  createUserCard: (data: UserCardInsert) => Promise<UserCardRecord | undefined>;
  updateUserCard: (id: number, data: UserCardUpdate) => Promise<UserCardRecord | undefined>;
  deleteUserCard: (id: number) => Promise<UserCardRecord | undefined>;
}

export interface ApiServices {
  users: UsersService;
  cards: CardsService;
  userCards: UserCardsService;
}

export const createApiApp = (services: ApiServices) =>
  new Elysia()
    .group("/users", (app) =>
      app
        .get("/", () => services.users.getAllUsers())
        .get("/:id", ({ params: { id } }) => services.users.getUserById(id), {
          params: t.Object({
            id: t.Numeric(),
          }),
        })
        .post("/", ({ body }) => services.users.createUser(body), {
          body: t.Object({
            email: t.String({ format: "email" }),
            username: t.String(),
            password: t.String(),
          }),
        })
        .put("/:id", ({ params: { id }, body }) => services.users.updateUser(id, body), {
          params: t.Object({
            id: t.Numeric(),
          }),
          body: t.Object({
            email: t.Optional(t.String({ format: "email" })),
            username: t.Optional(t.String()),
            password: t.Optional(t.String()),
          }),
        })
        .delete("/:id", ({ params: { id } }) => services.users.deleteUser(id), {
          params: t.Object({
            id: t.Numeric(),
          }),
        }),
    )
    .group("/cards", (app) =>
      app
        .get("/", () => services.cards.getAllCards())
        .get("/:id", ({ params: { id } }) => services.cards.getCardById(id), {
          params: t.Object({
            id: t.Numeric(),
          }),
        })
        .post("/", ({ body }) => services.cards.createCard(body as CardInsert), {
          body: t.Object({
            name: t.String(),
            image: t.String(),
            rarity: t.String(),
            archetype: t.String(),
            faction: t.String(),
            goldMultiplier: t.Optional(t.Numeric()),
            pullRateBoost: t.Optional(t.Numeric()),
            conversionRatio: t.Optional(t.Numeric()),
            buffValue: t.Optional(t.Numeric()),
            buffDirection: t.Optional(t.String()),
            prestigePoints: t.Optional(t.Numeric()),
          }),
        })
        .put("/:id", ({ params: { id }, body }) => services.cards.updateCard(id, body as CardUpdate), {
          params: t.Object({
            id: t.Numeric(),
          }),
          body: t.Object({
            name: t.Optional(t.String()),
            image: t.Optional(t.String()),
            rarity: t.Optional(t.String()),
            archetype: t.Optional(t.String()),
            faction: t.Optional(t.String()),
            goldMultiplier: t.Optional(t.Numeric()),
            pullRateBoost: t.Optional(t.Numeric()),
            conversionRatio: t.Optional(t.Numeric()),
            buffValue: t.Optional(t.Numeric()),
            buffDirection: t.Optional(t.String()),
            prestigePoints: t.Optional(t.Numeric()),
          }),
        })
        .delete("/:id", ({ params: { id } }) => services.cards.deleteCard(id), {
          params: t.Object({
            id: t.Numeric(),
          }),
        }),
    )
    .group("/user-cards", (app) =>
      app
        .get("/", () => services.userCards.getAllUserCards())
        .get("/user/:userId", ({ params: { userId } }) => services.userCards.getUserCardsByUserId(userId), {
          params: t.Object({
            userId: t.Numeric(),
          }),
        })
        .post("/", ({ body }) => services.userCards.createUserCard(body), {
          body: t.Object({
            userId: t.Numeric(),
            cardId: t.Numeric(),
            level: t.Optional(t.Numeric()),
            exp: t.Optional(t.Numeric()),
            eidolonLevel: t.Optional(t.Numeric()),
          }),
        })
        .put("/:id", ({ params: { id }, body }) => services.userCards.updateUserCard(id, body), {
          params: t.Object({
            id: t.Numeric(),
          }),
          body: t.Object({
            level: t.Optional(t.Numeric()),
            exp: t.Optional(t.Numeric()),
            eidolonLevel: t.Optional(t.Numeric()),
          }),
        })
        .delete("/:id", ({ params: { id } }) => services.userCards.deleteUserCard(id), {
          params: t.Object({
            id: t.Numeric(),
          }),
        }),
    );

export type ApiApp = ReturnType<typeof createApiApp>;
