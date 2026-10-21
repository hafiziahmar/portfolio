import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { RecruiterMessage } from '../types';
import {
  Shield,
  Lock,
  Mail,
  User,
  Trash2,
  CheckCircle,
  RefreshCw,
  LogOut,
  Save,
  AlertCircle,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface AdminPageProps {
  onBackToPortfolio: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToPortfolio }) => {
  const { admin, isAuthenticated, login, logout } = useAuth();

  // Login form state
  const [username, setUsername] = useState('hafizi_admin');
  const [password, setPassword] = useState('your_secure_admin_password_here2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'messages' | 'profile' | 'cache'>('messages');
  const [messages, setMessages] = useState<RecruiterMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<RecruiterMessage | null>(null);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [isFlushing, setIsFlushing] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: 'Hafizi Ahmar',
    title: 'AI-Enabled Full-Stack Developer | Autonomous Workflows | Clinical Domain Expertise',
    summary: '',
    status_badge: 'Open for Full-Stack & AI Roles',
    location: 'Malaysia (Available for Global Remote Roles)',
    linkedin_url: 'https://www.linkedin.com/in/hafizi-ahmar/',
    github_url: 'https://github.com/hafizi-ahmar',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  // Load initial dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      loadProfileData();
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

  const loadProfileData = async () => {
    try {
      const data = await api.getPortfolio(true);
      if (data.profile) {
        setProfileForm({
          name: data.profile.name,
          title: data.profile.title,
          summary: data.profile.summary,
          status_badge: data.profile.status_badge || 'Open for Full-Stack & AI Roles',
          location: data.profile.location || 'Malaysia (Available for Global Remote Roles)',
          linkedin_url: data.profile.linkedin_url || '',
          github_url: data.profile.github_url || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile for admin', err);
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
      setProfileFeedback('Profile records updated in PostgreSQL and Redis cache cleared successfully!');
    } catch (err: any) {
      setProfileFeedback(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleFlushCache = async () => {
    setIsFlushing(true);
    setCacheMessage(null);
    try {
      const res = await api.adminFlushCache();
      setCacheMessage(res.message || 'Redis cache flushed successfully.');
    } catch (err: any) {
      setCacheMessage('Failed to flush Redis cache.');
    } finally {
      setIsFlushing(false);
    }
  };

  // If not logged in, render secure login view
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
              Secure JWT authentication & bcrypt credential verification
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
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
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
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text focus:outline-none focus:ring-2 focus:ring-sand-moss"
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

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 rounded-xl bg-sand-surface-muted border border-sand-border text-2xs space-y-1">
            <div className="font-semibold text-sand-moss font-mono uppercase">
              Demo Credentials Hint:
            </div>
            <div className="text-sand-text-muted font-mono">
              Username: <span className="text-sand-text font-bold">hafizi_admin</span><br />
              Password: <span className="text-sand-text font-bold">your_secure_admin_password_here2026!</span>
            </div>
          </div>

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
            Signed in as <span className="font-semibold text-sand-text">{admin?.username}</span> ({admin?.email})
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
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Recruiter Inquiries</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-sand-amber text-white text-3xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          type="button"
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Edit Profile & Headline</span>
        </button>

        <button
          onClick={() => setActiveTab('cache')}
          type="button"
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'cache'
              ? 'bg-sand-moss text-white shadow-2xs'
              : 'bg-sand-surface border border-sand-border text-sand-text-muted hover:text-sand-text'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Redis Cache & System</span>
        </button>
      </div>

      {/* TAB 1: Recruiter Messages Queue */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List */}
          <div className="lg:col-span-6 rounded-2xl border border-sand-border bg-sand-surface p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-sand-border pb-3">
              <h2 className="text-base font-bold text-sand-text">
                Incoming Recruiter Queue ({messages.length})
              </h2>
              <button
                onClick={loadMessages}
                type="button"
                className="p-1.5 rounded-lg text-sand-text-muted hover:text-sand-text hover:bg-sand-surface-muted transition-colors cursor-pointer"
                title="Refresh messages"
              >
                <RefreshCw className={`w-4 h-4 ${loadingMessages ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {messages.length === 0 ? (
              <p className="text-xs text-sand-text-muted py-8 text-center">
                No recruiter inquiries received yet. Submit a test inquiry via the public portfolio form!
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

          {/* Details Pane */}
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

                {/* Message Content */}
                <div className="space-y-2">
                  <span className="text-2xs font-mono font-semibold uppercase text-sand-text-muted">
                    Message Body:
                  </span>
                  <div className="p-4 rounded-xl bg-sand-surface-muted border border-sand-border text-xs sm:text-sm text-sand-text leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Status Updater Buttons */}
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
                <p className="text-xs">Select a recruiter inquiry from the queue to view full content.</p>
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
              Database Profile Records (Approach B CMS)
            </h2>
            <p className="text-xs text-sand-text-muted">
              Directly updates PostgreSQL 'profile' table and triggers automatic Redis cache eviction.
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
                  className="w-full px-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">Status Badge</label>
                <input
                  type="text"
                  value={profileForm.status_badge}
                  onChange={(e) => setProfileForm({ ...profileForm, status_badge: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
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
                className="w-full px-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-sand-text">Professional Summary</label>
              <textarea
                rows={4}
                value={profileForm.summary}
                onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profileForm.linkedin_url}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-sand-text">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profileForm.github_url}
                  onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text"
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

      {/* TAB 3: Redis Cache & System Status */}
      {activeTab === 'cache' && (
        <div className="max-w-2xl rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-sand-text">Redis Caching & Invalidation Control</h2>
            <p className="text-xs text-sand-text-muted">
              Manage high-speed in-memory cache keys. Writes automatically invalidate stale keys, but you can force an explicit flush here.
            </p>
          </div>

          {cacheMessage && (
            <div className="p-3.5 rounded-xl bg-sand-amber/10 border border-sand-amber/20 text-sand-amber text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{cacheMessage}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-sand-surface-muted border border-sand-border space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-sand-text">
              Active Strategy:
            </h3>
            <ul className="text-xs text-sand-text-muted space-y-1.5 list-disc pl-4">
              <li>Key: <code className="font-mono text-sand-moss">portfolio:full_data</code> (TTL: 300 seconds)</li>
              <li>Auto-invalidation on any CMS write (POST, PUT, DELETE)</li>
              <li>Resilient fallbacks to in-memory cache if standalone Redis cluster is unavailable</li>
            </ul>
          </div>

          <button
            onClick={handleFlushCache}
            disabled={isFlushing}
            type="button"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sand-amber text-white text-xs font-semibold hover:bg-sand-amber-hover disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isFlushing ? 'animate-spin' : ''}`} />
            <span>{isFlushing ? 'Flushing Redis...' : 'Flush Redis In-Memory Cache'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
