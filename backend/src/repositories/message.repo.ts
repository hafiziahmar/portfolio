import { pool } from '../config/db.js';

export interface MessageRecord {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_organization: string | null;
  subject: string;
  message: string;
  ip_address: string | null;
  status: 'unread' | 'read' | 'archived' | 'replied';
  created_at: string;
}

export class MessageRepository {
  async getAllMessages(): Promise<MessageRecord[]> {
    const res = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    return res.rows;
  }

  async getMessageById(id: number): Promise<MessageRecord | null> {
    const res = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async createMessage(data: Omit<MessageRecord, 'id' | 'created_at' | 'status'>): Promise<MessageRecord> {
    const res = await pool.query(
      `INSERT INTO messages (sender_name, sender_email, sender_organization, subject, message, ip_address, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'unread')
       RETURNING *`,
      [
        data.sender_name,
        data.sender_email,
        data.sender_organization,
        data.subject,
        data.message,
        data.ip_address,
      ]
    );
    return res.rows[0];
  }

  async updateMessageStatus(id: number, status: MessageRecord['status']): Promise<MessageRecord | null> {
    const res = await pool.query(
      `UPDATE messages
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return res.rows[0] || null;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const res = await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
}

export const messageRepo = new MessageRepository();
