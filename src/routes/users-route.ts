import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body, set }) => {
    try {
      const { name, email, password } = body;
      await UsersService.register(name, email, password);
      
      set.status = 201; // Created
      return { data: 'OK' };
    } catch (error: any) {
      if (error.message === 'Email sudah terdaftar') {
        set.status = 400; // Bad Request
        return { error: 'Email sudah terdaftar' };
      }
      
      set.status = 500; // Internal Server Error
      return { error: 'Terjadi kesalahan pada server', details: error.message };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
    })
  });
