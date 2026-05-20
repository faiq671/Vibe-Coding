import { db } from '../db';
import { users, sessions } from '../db/schema';
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

  /**
   * Login user dan membuat session baru
   * @param email Email user
   * @param password Password plain-text
   */
  static async login(email: string, password: string) {
    // 1. Cari user berdasarkan email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Email atau password salah');
    }

    // 2. Verifikasi password
    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email atau password salah');
    }

    // 3. Buat token session UUID
    const token = crypto.randomUUID();

    // 4. Simpan ke database sessions
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return token;
  }
}
