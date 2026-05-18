import { Elysia, t } from 'elysia';
import { db, users } from './db';

const app = new Elysia()
  .get('/', () => ({ 
    status: 'ok', 
    message: 'Hello World dari ElysiaJS!' 
  }))
  .get('/users', async () => {
    try {
      const allUsers = await db.select().from(users);
      return { success: true, data: allUsers };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Gagal mengambil data user. Pastikan MySQL sudah menyala dan migrasi sudah dijalankan.',
        details: error.message 
      };
    }
  })
  .post('/users', async ({ body }) => {
    try {
      await db.insert(users).values({
        name: body.name,
        email: body.email,
      });
      return { success: true, message: 'User berhasil dibuat!' };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Gagal membuat user.',
        details: error.message 
      };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
    })
  })
  .listen(process.env.PORT || 3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
