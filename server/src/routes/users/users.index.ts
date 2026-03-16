import { Elysia, t } from 'elysia';
import { usersService } from './users.service';

export const usersRoute = new Elysia({ prefix: '/users' })
  .get('/', () => usersService.getAllUsers())
  .get('/:id', ({ params: { id } }) => usersService.getUserById(id), {
    params: t.Object({
      id: t.Numeric()
    })
  })
  .post('/', ({ body }) => usersService.createUser(body), {
    body: t.Object({
      email: t.String({ format: 'email' }),
      username: t.String(),
      password: t.String()
    })
  })
  .put('/:id', ({ params: { id }, body }) => usersService.updateUser(id, body), {
    params: t.Object({
      id: t.Numeric()
    }),
    body: t.Object({
      email: t.Optional(t.String({ format: 'email' })),
      username: t.Optional(t.String()),
      password: t.Optional(t.String())
    })
  })
  .delete('/:id', ({ params: { id } }) => usersService.deleteUser(id), {
    params: t.Object({
      id: t.Numeric()
    })
  });
