import { pool } from '../config/db.js';

export interface AdminRecord {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export class AdminRepository {
  async findByUsername(username: string): Promise<AdminRecord | null> {
    const res = await pool.query('SELECT * FROM admins WHERE username = $1 LIMIT 1', [username]);
    return res.rows[0] || null;
  }

  async findById(id: number): Promise<AdminRecord | null> {
    const res = await pool.query('SELECT * FROM admins WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  async updatePassword(id: number, passwordHash: string): Promise<boolean> {
    const res = await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const adminRepo = new AdminRepository();
