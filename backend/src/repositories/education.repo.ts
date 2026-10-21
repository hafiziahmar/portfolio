import { pool } from '../config/db.js';

export interface EducationRecord {
  id: number;
  institution: string;
  degree: string;
  period?: string | null;
  start_date?: string | null;
  end_date?: string | null;
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

  async createEducation(data: Partial<EducationRecord>): Promise<EducationRecord> {
    const start_date = data.start_date || '2026';
    const end_date = data.end_date || '2026';
    const period = data.period || (start_date === end_date ? start_date : `${start_date} – ${end_date}`);

    const res = await pool.query(
      `INSERT INTO education (institution, degree, period, start_date, end_date, field_of_study, description, badges, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.institution || '',
        data.degree || '',
        period,
        start_date,
        end_date,
        data.field_of_study || null,
        data.description || null,
        data.badges || [],
        data.order_index ?? 0,
      ]
    );
    return res.rows[0];
  }

  async updateEducation(id: number, data: Partial<EducationRecord>): Promise<EducationRecord | null> {
    const res = await pool.query(
      `UPDATE education
       SET institution = COALESCE($1, institution),
           degree = COALESCE($2, degree),
           period = COALESCE($3, period),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           field_of_study = COALESCE($6, field_of_study),
           description = COALESCE($7, description),
           badges = COALESCE($8, badges),
           order_index = COALESCE($9, order_index)
       WHERE id = $10
       RETURNING *`,
      [
        data.institution,
        data.degree,
        data.period,
        data.start_date,
        data.end_date,
        data.field_of_study,
        data.description,
        data.badges,
        data.order_index,
        id,
      ]
    );
    return res.rows[0] || null;
  }

  async deleteEducation(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM education WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const educationRepo = new EducationRepository();
