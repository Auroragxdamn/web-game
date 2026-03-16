import { Elysia } from "elysia";
import { usersRoute } from "./users/users.index";
import { userCardsRoute } from "./userCards/userCards.index";
import { cardsRoute } from "./cards/cards.index";

export const api = new Elysia()
  .use(usersRoute)
  .use(userCardsRoute)
  .use(cardsRoute);