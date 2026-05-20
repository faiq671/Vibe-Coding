import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export class UsersService {
  /**
   * Registrasi user baru
   * @param name Nama user
   * @param email Email user (unik)
   * @param password Password plain-text yang akan di-hash
   */
  static async register(name: string, email: string, password: string) {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Email sudah terdaftar');
    }

    // 2. Hash password menggunakan Bun.password (menggunakan bcrypt di bawah kap)
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    // 3. Simpan ke database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { success: true };
  }
}
