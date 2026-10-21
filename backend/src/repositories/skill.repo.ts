import { pool } from '../config/db.js';

export interface SkillRecord {
  id: number;
  category: string;
  name: string;
  proficiency_level: number;
  highlight: boolean;
  order_index: number;
  created_at: string;
}

export class SkillRepository {
  async getAllSkills(): Promise<SkillRecord[]> {
    const res = await pool.query(
      'SELECT * FROM skills ORDER BY order_index ASC, id ASC'
    );
    return res.rows;
  }

  async getSkillsByCategory(category: string): Promise<SkillRecord[]> {
    const res = await pool.query(
      'SELECT * FROM skills WHERE category = $1 ORDER BY order_index ASC',
      [category]
    );
    return res.rows;
  }

  async createSkill(data: Omit<SkillRecord, 'id' | 'created_at'>): Promise<SkillRecord> {
    const res = await pool.query(
      `INSERT INTO skills (category, name, proficiency_level, highlight, order_index)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.category, data.name, data.proficiency_level, data.highlight, data.order_index]
    );
    return res.rows[0];
  }

  async updateSkill(id: number, data: Partial<SkillRecord>): Promise<SkillRecord | null> {
    const res = await pool.query(
      `UPDATE skills
       SET category = COALESCE($1, category),
           name = COALESCE($2, name),
           proficiency_level = COALESCE($3, proficiency_level),
           highlight = COALESCE($4, highlight),
           order_index = COALESCE($5, order_index)
       WHERE id = $6
       RETURNING *`,
      [data.category, data.name, data.proficiency_level, data.highlight, data.order_index, id]
    );
    return res.rows[0] || null;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const skillRepo = new SkillRepository();
