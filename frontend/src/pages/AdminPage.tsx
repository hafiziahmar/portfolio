import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { RecruiterMessage, Experience, Skill, Project, Education } from '../types';
import {
  Shield,
  Lock,
  Mail,
  User,
  Trash2,
  CheckCircle,
  LogOut,
  Save,
  AlertCircle,
  Eye,
  ArrowLeft,
  Briefcase,
  Layers,
  Wrench,
  GraduationCap,
  KeyRound,
  Plus,
  Edit2,
  X
} from 'lucide-react';

interface AdminPageProps {
  onBackToPortfolio: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToPortfolio }) => {
  const { admin, isAuthenticated, login, logout } = useAuth();

  // Login form state - Clean & Empty by default
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'messages' | 'profile' | 'experiences' | 'projects' | 'skills' | 'education' | 'security'>('messages');

  // Messages State
  const [messages, setMessages] = useState<RecruiterMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<RecruiterMessage | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    summary: '',
    status_badge: '',
    location: '',
    linkedin_url: '',
    github_url: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  // Experiences State
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);
  const [expFeedback, setExpFeedback] = useState<string | null>(null);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projFeedback, setProjFeedback] = useState<string | null>(null);

  // Skills State
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillForm, setNewSkillForm] = useState({
    category: 'Full-Stack Technologies',
    name: '',
    proficiency_level: 5,
    highlight: false,
    order_index: 0,
  });
  const [skillFeedback, setSkillFeedback] = useState<string | null>(null);

  // Education State
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isNewEdu, setIsNewEdu] = useState(false);
  const [eduFeedback, setEduFeedback] = useState<string | null>(null);

  // Security & Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load all dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      loadAllPortfolioData();
    }
  }, [isAuthenticated]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const list = await api.adminGetMessages();
      setMessages(list);
    } catch (err: any) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadAllPortfolioData = async () => {
    try {
      const data = await api.getPortfolio(true);
      if (data.profile) {
        setProfileForm({
          name: data.profile.name,
          title: data.profile.title,
          summary: data.profile.summary,
          status_badge: data.profile.status_badge || '',
          location: data.profile.location || '',
          linkedin_url: data.profile.linkedin_url || '',
          github_url: data.profile.github_url || '',
        });
      }
      setExperiences(data.experiences || []);
      setProjects(data.projects || []);
      setSkills(data.skills || []);
      setEducationList(data.education || []);
    } catch (err) {
      console.error('Failed to load portfolio data for admin', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.adminUpdateMessageStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus as any } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update message status');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this message record?')) return;
    try {
      await api.adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete message');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback(null);
    try {
      await api.adminUpdateProfile(profileForm);
      setProfileFeedback('Profile records successfully updated in the database!');
      await loadAllPortfolioData();
    } catch (err: any) {
      setProfileFeedback(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Experience handlers
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    try {
      if (isNewExp) {
        await api.adminCreateExperience(editingExp);
        setExpFeedback('New experience record created successfully!');
      } else {
        await api.adminUpdateExperience(editingExp.id, editingExp);
        setExpFeedback('Experience record updated successfully!');
      }
      setEditingExp(null);
      setIsNewExp(false);
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to save experience');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      await api.adminDeleteExperience(id);
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete experience');
    }
  };

  // Project handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      if (isNewProject) {
        await api.adminCreateProject(editingProject);
        setProjFeedback('New project created successfully!');
      } else {
        await api.adminUpdateProject(editingProject.id, editingProject);
        setProjFeedback('Project details updated successfully!');
      }
      setEditingProject(null);
      setIsNewProject(false);
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.adminDeleteProject(id);
      setProjFeedback('Project deleted successfully!');
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project');
    }
  };

  // Skills handlers
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.name.trim()) return;
    try {
      await api.adminCreateSkill(newSkillForm);
      setNewSkillForm({
        category: 'Full-Stack Technologies',
        name: '',
        proficiency_level: 5,
        highlight: false,
        order_index: skills.length + 1,
      });
      setSkillFeedback('Skill added successfully!');
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.adminDeleteSkill(id);
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete skill');
    }
  };

  // Education handlers
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    try {
      const start = editingEdu.start_date?.trim() || '';
      const end = editingEdu.end_date?.trim() || '';
      const period = (!end || start === end) ? start : `${start} – ${end}`;
      const payload = {
        ...editingEdu,
        period: period || editingEdu.period || '',
      };

      if (isNewEdu) {
        await api.adminCreateEducation(payload);
        setEduFeedback('Education credential added successfully!');
      } else {
        await api.adminUpdateEducation(editingEdu.id, payload);
        setEduFeedback('Education credential updated successfully!');
      }
      setEditingEdu(null);
      setIsNewEdu(false);
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to save education record');
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Delete this education credential?')) return;
    try {
      await api.adminDeleteEducation(id);
      await loadAllPortfolioData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete education record');
    }
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordFeedback(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.adminChangePassword(currentPassword, newPassword);
      setPasswordFeedback(res.message || 'Password successfully updated in the database!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // If not logged in, render clean login form with zero hints
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-sand-surface border border-sand-border rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sand-moss/15 text-sand-moss flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-sand-text">Admin CMS Login</h2>
            <p className="text-xs text-sand-text-muted">
              Secure authentication & credential verification
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-sand-text font-mono">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-sand-text-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-sand-text font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sand-text-muted absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-sand-moss text-white font-medium text-sm hover:bg-sand-moss-hover disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBackToPortfolio}
              type="button"
              className="inline-flex items-center space-x-1 text-xs text-sand-text-muted hover:text-sand-text transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portfolio</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sand-moss font-mono">
            <Shield className="w-4 h-4" />
            <span>Authenticated CMS Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-text mt-1">
            Admin Management Console
          </h1>
          <p className="text-xs text-sand-text-muted">
            Signed in as <span className="font-semibold text-sand-text">{admin?.username}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToPortfolio}
            type="button"
            className="px-3.5 py-2 rounded-xl border border-sand-border bg-sand-surface text-xs font-semibold text-sand-text hover:bg-sand-surface-muted transition-colors cursor-pointer"
          >
            View Live Portfolio
          </button>

          <button
            onClick={logout}
            type="button"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-sand-border pb-3">
        <button
          onClick={() => setActiveTab('messages')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inquiries</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-sand-amber text-white text-3xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'experiences'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Experiences ({experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Skills ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'education'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education ({educationList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          type="button"
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'security'
              ? 'bg-sand-amber text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* TAB 1: Recruiter Messages Queue */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border border-sand-border bg-sand-surface p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-sand-text border-b border-sand-border pb-3 flex items-center justify-between">
              <span>Incoming Recruiter Queue ({messages.length})</span>
              {loadingMessages && <span className="text-xs font-mono text-sand-moss">Refreshing...</span>}
            </h2>

            {messages.length === 0 ? (
              <p className="text-xs text-sand-text-muted py-8 text-center">
                No recruiter inquiries received yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMessage(m);
                      if (m.status === 'unread') {
                        handleStatusChange(m.id, 'read');
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedMessage?.id === m.id
                        ? 'border-sand-moss bg-sand-surface-muted'
                        : 'border-sand-border bg-sand-surface hover:border-sand-moss/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-sand-text">{m.sender_name}</span>
                      <span className={`text-3xs font-mono font-semibold px-2 py-0.5 rounded-full ${
                        m.status === 'unread'
                          ? 'bg-sand-amber/20 text-sand-amber'
                          : m.status === 'replied'
                          ? 'bg-sand-moss/20 text-sand-moss'
                          : 'bg-sand-surface-muted text-sand-text-muted'
                      }`}>
                        {m.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-sand-text line-clamp-1">
                      {m.subject}
                    </div>

                    <div className="flex items-center justify-between text-2xs text-sand-text-muted mt-2 font-mono">
                      <span>{m.sender_organization || 'Direct Recruiter'}</span>
                      <span>{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-sand-border bg-sand-surface p-5 sm:p-6 shadow-xs">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-sand-border pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-sand-text">
                      {selectedMessage.subject}
                    </h3>
                    <p className="text-xs text-sand-text-muted mt-0.5">
                      From: <span className="text-sand-text font-semibold">{selectedMessage.sender_name}</span> ({selectedMessage.sender_email})
                    </p>
                    {selectedMessage.sender_organization && (
                      <p className="text-2xs font-mono text-sand-moss mt-0.5">
                        Company: {selectedMessage.sender_organization}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    type="button"
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-2xs font-mono font-semibold uppercase text-sand-text-muted">
                    Message Body:
                  </span>
                  <div className="p-4 rounded-xl bg-sand-surface-muted border border-sand-border text-xs sm:text-sm text-sand-text leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-mono text-sand-text-muted mr-2">
                    Update Status:
                  </span>
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg border border-sand-border text-xs font-medium hover:bg-sand-surface-muted transition-colors cursor-pointer"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors cursor-pointer"
                  >
                    Mark Replied
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg border border-sand-border text-xs font-medium hover:bg-sand-surface-muted transition-colors cursor-pointer"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-sand-text-muted">
                <Eye className="w-8 h-8 opacity-40" />
                <p className="text-xs">Select an inquiry to view full message.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Edit Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-sand-text">
              Profile & Headline Information
            </h2>
            <p className="text-xs text-sand-text-muted">
              Updates your live personal profile and bio stored in PostgreSQL.
            </p>
          </div>

          {profileFeedback && (
            <div className="p-3.5 rounded-xl bg-sand-moss/10 border border-sand-moss/20 text-sand-moss text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{profileFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">Status Badge</label>
                <input
                  type="text"
                  value={profileForm.status_badge}
                  onChange={(e) => setProfileForm({ ...profileForm, status_badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">Title / Headline</label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">Professional Summary</label>
              <textarea
                rows={5}
                value={profileForm.summary}
                onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profileForm.linkedin_url}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profileForm.github_url}
                  onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Experiences */}
      {activeTab === 'experiences' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-sand-text">
              Work Experiences ({experiences.length})
            </h2>
            <button
              onClick={() => {
                setEditingExp({
                  id: 0,
                  company: '',
                  role: '',
                  location: 'Malaysia',
                  start_date: '2025',
                  end_date: '2026',
                  is_current: false,
                  description: '',
                  achievements: [],
                  technologies: [],
                  order_index: experiences.length + 1,
                });
                setIsNewExp(true);
              }}
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>

          {expFeedback && (
            <div className="p-3.5 rounded-xl bg-sand-moss/10 border border-sand-moss/20 text-sand-moss text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{expFeedback}</span>
            </div>
          )}

          {/* Edit/Create Modal */}
          {editingExp && (
            <div className="p-6 rounded-2xl border border-sand-moss bg-sand-surface-muted shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <h3 className="text-sm font-bold text-sand-text">
                  {isNewExp ? 'Add New Experience' : `Edit: ${editingExp.company}`}
                </h3>
                <button
                  onClick={() => setEditingExp(null)}
                  type="button"
                  className="p-1 rounded-lg text-sand-text-muted hover:text-sand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveExperience} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Company</label>
                    <input
                      type="text"
                      value={editingExp.company}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Role</label>
                    <input
                      type="text"
                      value={editingExp.role}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Start Date</label>
                    <input
                      type="text"
                      placeholder="e.g. May 2025 or 2024"
                      value={editingExp.start_date}
                      onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">End Date (same as start if single year)</label>
                    <input
                      type="text"
                      placeholder="e.g. Mar 2026 or 2024"
                      value={editingExp.end_date}
                      onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Location</label>
                    <input
                      type="text"
                      value={editingExp.location || ''}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-sand-text">Description</label>
                  <textarea
                    rows={3}
                    value={editingExp.description}
                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingExp(null)}
                    className="px-4 py-2 rounded-xl border border-sand-border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold"
                  >
                    Save Experience
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Experience Cards */}
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl border border-sand-border bg-sand-surface shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sand-text text-sm sm:text-base">{exp.role}</h3>
                    <span className="text-xs font-mono text-sand-amber px-2 py-0.5 rounded bg-sand-surface-muted">
                      {!exp.end_date || exp.start_date.trim() === exp.end_date.trim()
                        ? exp.start_date
                        : `${exp.start_date} – ${exp.end_date}`}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-sand-moss">{exp.company}</p>
                  <p className="text-xs text-sand-text-muted line-clamp-2">{exp.description}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingExp(exp);
                      setIsNewExp(false);
                    }}
                    type="button"
                    className="p-2 rounded-lg border border-sand-border text-sand-text hover:bg-sand-surface-muted"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    type="button"
                    className="p-2 rounded-lg border border-sand-border text-red-500 hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-sand-text">
                Projects Management ({projects.length})
              </h2>
              <p className="text-xs text-sand-text-muted">
                Manage project name, start/end dates, and description. All wording is 100% controlled by you.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProject({
                  id: 0,
                  title: '',
                  tagline: '',
                  start_date: '2026',
                  end_date: '2026',
                  description: '',
                  architecture_details: '',
                  key_features: [],
                  tech_stack: [],
                  github_url: '',
                  demo_url: '',
                  featured: true,
                  order_index: projects.length + 1,
                });
                setIsNewProject(true);
              }}
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          {projFeedback && (
            <div className="p-3.5 rounded-xl bg-sand-moss/10 border border-sand-moss/20 text-sand-moss text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{projFeedback}</span>
            </div>
          )}

          {/* Edit/Create Project Form */}
          {editingProject && (
            <div className="p-6 rounded-2xl border border-sand-moss bg-sand-surface-muted shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <h3 className="text-sm font-bold text-sand-text">
                  {isNewProject ? 'Add New Project' : `Edit: ${editingProject.title}`}
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  type="button"
                  className="p-1 rounded-lg text-sand-text-muted hover:text-sand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-semibold text-sand-text">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. URUS — Integrated SME Operations Platform"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Start Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Aug 2026 or 2026"
                      value={editingProject.start_date || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">End Date (same as start if single year)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sep 2026 or 2026"
                      value={editingProject.end_date || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, end_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-sand-text">
                    Description (All project details & bullets from CV)
                  </label>
                  <textarea
                    rows={6}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    required
                    placeholder="Enter project summary and bullet points..."
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-sand-text">Tagline / Subheading (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Outbound fulfillment queue, multi-stage order lifecycles..."
                    value={editingProject.tagline || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-sand-text">Architecture & Data Design (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Optional technical notes for modal inspection..."
                    value={editingProject.architecture_details || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, architecture_details: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl border border-sand-border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Project List */}
          <div className="space-y-3">
            {projects.map((p) => {
              const dateText = p.start_date && p.end_date
                ? (p.start_date.trim() === p.end_date.trim() ? p.start_date : `${p.start_date} – ${p.end_date}`)
                : (p.start_date || p.end_date || '');

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl border border-sand-border bg-sand-surface shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sand-text text-sm sm:text-base">{p.title}</h3>
                      {dateText && (
                        <span className="text-xs font-mono text-sand-amber px-2 py-0.5 rounded bg-sand-surface-muted">
                          {dateText}
                        </span>
                      )}
                    </div>
                    {p.tagline && <p className="text-xs font-medium text-sand-moss">{p.tagline}</p>}
                    <p className="text-xs text-sand-text-muted line-clamp-2">{p.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProject(p);
                        setIsNewProject(false);
                      }}
                      type="button"
                      className="p-2 rounded-lg border border-sand-border text-sand-text hover:bg-sand-surface-muted"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      type="button"
                      className="p-2 rounded-lg border border-sand-border text-red-500 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Skills Matrix */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-sand-text">Technical Skills Inventory ({skills.length})</h2>
              <p className="text-xs text-sand-text-muted">Directly manage skills, categories, and ratings.</p>
            </div>
          </div>

          {skillFeedback && (
            <div className="p-3.5 rounded-xl bg-sand-moss/10 border border-sand-moss/20 text-sand-moss text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{skillFeedback}</span>
            </div>
          )}

          {/* Add Skill Form */}
          <div className="p-5 rounded-2xl border border-sand-border bg-sand-surface-muted space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-sand-text">Add New Skill</h3>
            <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-xs font-mono text-sand-text-muted block mb-1">
                  Category (Select or Type New)
                </label>
                <input
                  type="text"
                  list="skills-category-options"
                  placeholder="Select or enter category..."
                  value={newSkillForm.category}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-xs"
                />
                <datalist id="skills-category-options">
                  {Array.from(new Set(skills.map((s) => s.category))).map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                  <option value="Autonomous AI Development & Workspaces" />
                  <option value="Full-Stack Technologies" />
                  <option value="Hands-On Verification & Tools" />
                  <option value="System Design & Workflows" />
                </datalist>
              </div>

              <div>
                <label className="text-xs font-mono text-sand-text-muted block mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Docker, GraphQL"
                  value={newSkillForm.name}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-sand-text-muted block mb-1">Proficiency (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={newSkillForm.proficiency_level}
                  onChange={(e) => setNewSkillForm({ ...newSkillForm, proficiency_level: parseInt(e.target.value, 10) || 5 })}
                  className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover h-[38px] cursor-pointer"
              >
                Add Skill
              </button>
            </form>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-sand-border bg-sand-surface flex items-center justify-between"
              >
                <div>
                  <div className="text-3xs font-mono text-sand-moss uppercase">{s.category}</div>
                  <div className="text-xs font-bold text-sand-text">{s.name}</div>
                  <div className="text-2xs font-mono text-sand-text-muted">Proficiency: {s.proficiency_level}/5</div>
                </div>

                <button
                  onClick={() => handleDeleteSkill(s.id)}
                  type="button"
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Education */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-sand-text">Education & Specialized Training ({educationList.length})</h2>
              <p className="text-xs text-sand-text-muted">
                Title, Education Provider, Dates, and Description. Only your wording is displayed.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEdu({
                  id: 0,
                  institution: '',
                  degree: '',
                  start_date: '2026',
                  end_date: '2026',
                  period: '2026',
                  field_of_study: '',
                  description: '',
                  badges: [],
                  order_index: educationList.length + 1,
                });
                setIsNewEdu(true);
              }}
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Credential</span>
            </button>
          </div>

          {eduFeedback && (
            <div className="p-3.5 rounded-xl bg-sand-moss/10 border border-sand-moss/20 text-sand-moss text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{eduFeedback}</span>
            </div>
          )}

          {/* Edit/Create Form */}
          {editingEdu && (
            <div className="p-6 rounded-2xl border border-sand-moss bg-sand-surface-muted shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <h3 className="text-sm font-bold text-sand-text">
                  {isNewEdu ? 'Add Education Credential' : `Edit: ${editingEdu.degree}`}
                </h3>
                <button
                  onClick={() => setEditingEdu(null)}
                  type="button"
                  className="p-1 rounded-lg text-sand-text-muted hover:text-sand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEducation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">
                      Title (Degree / Program Name)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bachelor of Dietetics (Hons.) or Project KADA Participant..."
                      value={editingEdu.degree}
                      onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Education Provider</label>
                    <input
                      type="text"
                      placeholder="e.g. Korea-ASEAN Digital Academy (KADA) or UiTM"
                      value={editingEdu.institution}
                      onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">Start Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Aug 2026 or 2020"
                      value={editingEdu.start_date || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, start_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-semibold text-sand-text">End Date (same as start if single year)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sep 2026 or 2020"
                      value={editingEdu.end_date || ''}
                      onChange={(e) => setEditingEdu({ ...editingEdu, end_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-semibold text-sand-text">Description</label>
                  <textarea
                    rows={5}
                    placeholder="Enter credential summary and clinical/technical details..."
                    value={editingEdu.description || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand-border bg-sand-surface text-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEdu(null)}
                    className="px-4 py-2 rounded-xl border border-sand-border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold"
                  >
                    Save Credential
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Education List */}
          <div className="space-y-3">
            {educationList.map((edu) => {
              const dateText = edu.start_date && edu.end_date
                ? (edu.start_date.trim() === edu.end_date.trim() ? edu.start_date : `${edu.start_date} – ${edu.end_date}`)
                : (edu.period || edu.start_date || '');

              return (
                <div
                  key={edu.id}
                  className="p-5 rounded-2xl border border-sand-border bg-sand-surface shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sand-text text-sm sm:text-base">{edu.degree}</h3>
                      {dateText && (
                        <span className="text-xs font-mono text-sand-amber px-2 py-0.5 rounded bg-sand-surface-muted">
                          {dateText}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-sand-moss">{edu.institution}</p>
                    {edu.description && <p className="text-xs text-sand-text-muted line-clamp-2">{edu.description}</p>}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingEdu(edu);
                        setIsNewEdu(false);
                      }}
                      type="button"
                      className="p-2 rounded-lg border border-sand-border text-sand-text hover:bg-sand-surface-muted"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      type="button"
                      className="p-2 rounded-lg border border-sand-border text-red-500 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: Security & Change Password */}
      {activeTab === 'security' && (
        <div className="max-w-xl rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-sand-text flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-sand-amber" />
              <span>Change Administrator Password</span>
            </h2>
            <p className="text-xs text-sand-text-muted">
              Update your account password. This will hash your new password with bcrypt and save it directly to the PostgreSQL database.
            </p>
          </div>

          {passwordFeedback && (
            <div className="p-3.5 rounded-xl bg-sand-moss/10 border border-sand-moss/20 text-sand-moss text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{passwordFeedback}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">
                Current Password <span className="text-sand-amber">*</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">
                New Password (minimum 8 characters) <span className="text-sand-amber">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Enter your new real password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">
                Confirm New Password <span className="text-sand-amber">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm your new real password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sand-amber text-white text-xs font-semibold hover:bg-sand-amber-hover disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isChangingPassword ? 'Updating Password...' : 'Save New Password'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
