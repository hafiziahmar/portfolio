import { pool } from '../config/db.js';

export interface ProjectRecord {
  id: number;
  title: string;
  tagline: string;
  description: string;
  architecture_details: string | null;
  key_features: string[];
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export class ProjectRepository {
  async getAllProjects(): Promise<ProjectRecord[]> {
    const res = await pool.query(
      'SELECT * FROM projects ORDER BY order_index ASC, id ASC'
    );
    return res.rows;
  }

  async getFeaturedProjects(): Promise<ProjectRecord[]> {
    const res = await pool.query(
      'SELECT * FROM projects WHERE featured = true ORDER BY order_index ASC'
    );
    return res.rows;
  }

  async getProjectById(id: number): Promise<ProjectRecord | null> {
    const res = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createProject(data: Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectRecord> {
    const res = await pool.query(
      `INSERT INTO projects (title, tagline, description, architecture_details, key_features, tech_stack, github_url, demo_url, featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.title,
        data.tagline,
        data.description,
        data.architecture_details,
        data.key_features,
        data.tech_stack,
        data.github_url,
        data.demo_url,
        data.featured,
        data.order_index,
      ]
    );
    return res.rows[0];
  }

  async updateProject(id: number, data: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
    const current = await this.getProjectById(id);
    if (!current) return null;

    const res = await pool.query(
      `UPDATE projects
       SET title = $1, tagline = $2, description = $3, architecture_details = $4,
           key_features = $5, tech_stack = $6, github_url = $7, demo_url = $8,
           featured = $9, order_index = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        data.title ?? current.title,
        data.tagline ?? current.tagline,
        data.description ?? current.description,
        data.architecture_details ?? current.architecture_details,
        data.key_features ?? current.key_features,
        data.tech_stack ?? current.tech_stack,
        data.github_url ?? current.github_url,
        data.demo_url ?? current.demo_url,
        data.featured ?? current.featured,
        data.order_index ?? current.order_index,
        id,
      ]
    );
    return res.rows[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const projectRepo = new ProjectRepository();
