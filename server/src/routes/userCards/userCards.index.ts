import { Elysia, t } from 'elysia';
import { userCardsService } from './userCards.service';

export const userCardsRoute = new Elysia({ prefix: '/user-cards' })
  .get('/', () => userCardsService.getAllUserCards())
  .get('/user/:userId', ({ params: { userId } }) => userCardsService.getUserCardsByUserId(userId), {
    params: t.Object({
      userId: t.Numeric()
    })
  })
  .post('/', ({ body }) => userCardsService.createUserCard(body as any), {
    body: t.Object({
      userId: t.Numeric(),
      cardId: t.Numeric(),
      level: t.Optional(t.Numeric()),
      exp: t.Optional(t.Numeric()),
      eidolonLevel: t.Optional(t.Numeric())
    })
  })
  .put('/:id', ({ params: { id }, body }) => userCardsService.updateUserCard(id, body as any), {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      level: t.Optional(t.Numeric()),
      exp: t.Optional(t.Numeric()),
      eidolonLevel: t.Optional(t.Numeric())
    })
  })
  .delete('/:id', ({ params: { id } }) => userCardsService.deleteUserCard(id), {
    params: t.Object({
      id: t.Numeric()
    })
  });
