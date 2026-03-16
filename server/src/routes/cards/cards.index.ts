import { Elysia, t } from 'elysia';
import { cardsService } from './cards.service';

export const cardsRoute = new Elysia({ prefix: '/cards' })
  .get('/', () => cardsService.getAllCards())
  .get('/:id', ({ params: { id } }) => cardsService.getCardById(id), {
    params: t.Object({ id: t.Numeric() })
  })
  .post('/', ({ body }) => cardsService.createCard(body as any), {
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
      prestigePoints: t.Optional(t.Numeric())
    })
  })
  .put('/:id', ({ params: { id }, body }) => cardsService.updateCard(id, body as any), {
    params: t.Object({ id: t.Numeric() }),
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
      prestigePoints: t.Optional(t.Numeric())
    })
  })
  .delete('/:id', ({ params: { id } }) => cardsService.deleteCard(id), {
    params: t.Object({ id: t.Numeric() })
  });
