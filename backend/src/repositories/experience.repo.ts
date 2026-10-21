import { pool } from '../config/db.js';

export interface ExperienceRecord {
  id: number;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export class ExperienceRepository {
  async getAllExperiences(): Promise<ExperienceRecord[]> {
    const res = await pool.query(
      'SELECT * FROM experiences ORDER BY order_index ASC, id ASC'
    );
    return res.rows;
  }

  async getExperienceById(id: number): Promise<ExperienceRecord | null> {
    const res = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createExperience(data: Omit<ExperienceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ExperienceRecord> {
    const res = await pool.query(
      `INSERT INTO experiences (company, role, location, start_date, end_date, is_current, description, achievements, technologies, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.company,
        data.role,
        data.location,
        data.start_date,
        data.end_date,
        data.is_current,
        data.description,
        data.achievements,
        data.technologies,
        data.order_index,
      ]
    );
    return res.rows[0];
  }

  async updateExperience(id: number, data: Partial<ExperienceRecord>): Promise<ExperienceRecord | null> {
    const current = await this.getExperienceById(id);
    if (!current) return null;

    const res = await pool.query(
      `UPDATE experiences
       SET company = $1, role = $2, location = $3, start_date = $4, end_date = $5,
           is_current = $6, description = $7, achievements = $8, technologies = $9,
           order_index = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        data.company ?? current.company,
        data.role ?? current.role,
        data.location ?? current.location,
        data.start_date ?? current.start_date,
        data.end_date ?? current.end_date,
        data.is_current ?? current.is_current,
        data.description ?? current.description,
        data.achievements ?? current.achievements,
        data.technologies ?? current.technologies,
        data.order_index ?? current.order_index,
        id,
      ]
    );
    return res.rows[0];
  }

  async deleteExperience(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM experiences WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const experienceRepo = new ExperienceRepository();
