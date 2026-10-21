import { pool } from '../config/db.js';

export interface EducationRecord {
  id: number;
  institution: string;
  degree: string;
  period: string;
  field_of_study: string | null;
  description: string | null;
  badges: string[];
  order_index: number;
  created_at: string;
}

export class EducationRepository {
  async getAllEducation(): Promise<EducationRecord[]> {
    const res = await pool.query(
      'SELECT * FROM education ORDER BY order_index ASC, id ASC'
    );
    return res.rows;
  }

  async createEducation(data: Omit<EducationRecord, 'id' | 'created_at'>): Promise<EducationRecord> {
    const res = await pool.query(
      `INSERT INTO education (institution, degree, period, field_of_study, description, badges, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.institution, data.degree, data.period, data.field_of_study, data.description, data.badges, data.order_index]
    );
    return res.rows[0];
  }

  async updateEducation(id: number, data: Partial<EducationRecord>): Promise<EducationRecord | null> {
    const res = await pool.query(
      `UPDATE education
       SET institution = COALESCE($1, institution),
           degree = COALESCE($2, degree),
           period = COALESCE($3, period),
           field_of_study = COALESCE($4, field_of_study),
           description = COALESCE($5, description),
           badges = COALESCE($6, badges),
           order_index = COALESCE($7, order_index)
       WHERE id = $8
       RETURNING *`,
      [data.institution, data.degree, data.period, data.field_of_study, data.description, data.badges, data.order_index, id]
    );
    return res.rows[0] || null;
  }

  async deleteEducation(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM education WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const educationRepo = new EducationRepository();
