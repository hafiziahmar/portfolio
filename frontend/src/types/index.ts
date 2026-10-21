export interface Profile {
  id: number;
  name: string;
  title: string;
  summary: string;
  linkedin_url: string;
  github_url: string;
  location: string;
  status_badge: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  category: 'Autonomous AI Development' | 'Full-Stack Technologies' | 'Tools & Verification' | string;
  name: string;
  proficiency_level: number;
  highlight: boolean;
  order_index: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location?: string | null;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  order_index: number;
}

export interface Project {
  id: number;
  title: string;
  tagline?: string;
  start_date?: string | null;
  end_date?: string | null;
  description: string;
  architecture_details?: string | null;
  key_features?: string[];
  tech_stack?: string[];
  github_url?: string | null;
  demo_url?: string | null;
  featured?: boolean;
  order_index?: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  period?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  field_of_study?: string | null;
  description?: string | null;
  badges?: string[];
  order_index?: number;
}

export interface RecruiterMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_organization?: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived' | 'replied';
  created_at: string;
}

export interface PortfolioData {
  profile: Profile | null;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  cachedAt?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
}
