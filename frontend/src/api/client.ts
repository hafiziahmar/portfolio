import { PortfolioData, RecruiterMessage, AdminUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('hafizi_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Public Portfolio Data
  async getPortfolio(bypassCache = false): Promise<PortfolioData> {
    const url = `${API_BASE_URL}/portfolio${bypassCache ? '?refresh=true' : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load portfolio data (HTTP ${res.status})`);
    }
    return res.json();
  },

  // Recruiter Contact Queue
  async submitContact(data: {
    sender_name: string;
    sender_email: string;
    sender_organization?: string;
    subject: string;
    message: string;
    honeypot?: string;
  }): Promise<{ success: boolean; message: string; id?: number }> {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to submit inquiry');
    }
    return json;
  },

  // AI CV Copilot
  async askCopilot(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'AI Copilot encountered an error');
    }
    return json.reply;
  },

  // Admin Authentication
  async adminLogin(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Authentication failed');
    }
    localStorage.setItem('hafizi_admin_token', json.token);
    return json;
  },

  async adminChangePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to update password');
    }
    return json;
  },

  async adminGetMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Session expired or unauthorized');
    }
    return res.json();
  },

  // Admin CMS Endpoints
  async adminUpdateProfile(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Skills
  async adminCreateSkill(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create skill');
    return res.json();
  },

  async adminUpdateSkill(id: number, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
  },

  async adminDeleteSkill(id: number) {
    const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete skill');
    return res.json();
  },

  // Experiences
  async adminCreateExperience(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
  },

  async adminUpdateExperience(id: number, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
  },

  async adminDeleteExperience(id: number) {
    const res = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete experience');
    return res.json();
  },

  // Projects
  async adminCreateProject(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async adminUpdateProject(id: number, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async adminDeleteProject(id: number) {
    const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Education
  async adminCreateEducation(data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/education`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create education record');
    return res.json();
  },

  async adminUpdateEducation(id: number, data: any) {
    const res = await fetch(`${API_BASE_URL}/admin/education/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update education record');
    return res.json();
  },

  async adminDeleteEducation(id: number) {
    const res = await fetch(`${API_BASE_URL}/admin/education/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete education record');
    return res.json();
  },

  async adminGetMessages(): Promise<RecruiterMessage[]> {
    const res = await fetch(`${API_BASE_URL}/admin/messages`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async adminUpdateMessageStatus(id: number, status: string) {
    const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update message status');
    return res.json();
  },

  async adminDeleteMessage(id: number) {
    const res = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  },

  async adminFlushCache() {
    const res = await fetch(`${API_BASE_URL}/admin/cache/flush`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to flush cache');
    return res.json();
  },
};
