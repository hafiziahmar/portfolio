import { pool } from '../config/db.js';

export interface ProfileRecord {
  id: number;
  name: string;
  title: string;
  summary: string;
  linkedin_url: string;
  github_url: string;
  location: string;
  status_badge: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export class ProfileRepository {
  async getProfile(): Promise<ProfileRecord | null> {
    const res = await pool.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    return res.rows[0] || null;
  }

  async updateProfile(data: Partial<ProfileRecord>): Promise<ProfileRecord> {
    const current = await this.getProfile();
    if (!current) {
      throw new Error('Profile not found to update');
    }

    const name = data.name ?? current.name;
    const title = data.title ?? current.title;
    const summary = data.summary ?? current.summary;
    const linkedin_url = data.linkedin_url ?? current.linkedin_url;
    const github_url = data.github_url ?? current.github_url;
    const location = data.location ?? current.location;
    const status_badge = data.status_badge ?? current.status_badge;
    const avatar_url = data.avatar_url ?? current.avatar_url;

    const res = await pool.query(
      `UPDATE profile
       SET name = $1, title = $2, summary = $3, linkedin_url = $4, github_url = $5,
           location = $6, status_badge = $7, avatar_url = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, title, summary, linkedin_url, github_url, location, status_badge, avatar_url, current.id]
    );

    return res.rows[0];
  }
}

export const profileRepo = new ProfileRepository();
