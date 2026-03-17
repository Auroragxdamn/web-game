import { createApiApp } from "@web-game/api";
import { cardsService } from "./cards/cards.service";
import { userCardsService } from "./userCards/userCards.service";
import { usersService } from "./users/users.service";

export const api = createApiApp({
  users: usersService,
  cards: cardsService,
  userCards: userCardsService,
});
