import React, { useState } from 'react';
import { Send, AlertCircle, Shield, Linkedin, Github, MailCheck } from 'lucide-react';
import { api } from '../api/client';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    sender_organization: '',
    subject: '',
    message: '',
    honeypot: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessResponse(null);

    try {
      const res = await api.submitContact(formData);
      setSuccessResponse(res.message);
      setFormData({
        sender_name: '',
        sender_email: '',
        sender_organization: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to deliver message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Recruiter Channel & Privacy Rule */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-sand-amber font-mono">
                <Shield className="w-4 h-4" />
                <span>Verified Direct Channel</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-text tracking-tight">
                Get In Touch
              </h2>
              <p className="text-base text-sand-text-muted leading-relaxed text-justify">
                Recruiters, hiring leaders, and engineering teams can reach Hafizi directly through this queue. Inquiries are stored in a dedicated PostgreSQL database queue and triaged immediately.
              </p>
            </div>

            {/* Privacy & Anti-Scraping Card */}
            <div className="p-5 rounded-2xl border border-sand-border bg-sand-surface shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 text-sand-moss">
                <Shield className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                  Privacy & Anti-Scraping Protection
                </h3>
              </div>
              <p className="text-xs text-sand-text-muted leading-relaxed text-justify">
                Raw personal contact numbers and personal emails are intentionally not published to prevent automated bots and telephone scrapers. Submitting through this verified form routes directly to Hafizi's authenticated priority dashboard.
              </p>
            </div>

            {/* Professional Profiles */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sand-text-muted block">
                Professional Networks:
              </span>
              <div className="flex items-center space-x-4">
                <a
                  href="https://www.linkedin.com/in/ahmad-hafizi-ahmar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-sand-border bg-sand-surface text-xs font-medium text-sand-text hover:bg-sand-surface-muted transition-colors shadow-2xs"
                >
                  <Linkedin className="w-4 h-4 text-sand-moss" />
                  <span>LinkedIn Profile</span>
                </a>
                <a
                  href="https://github.com/hafiziahmar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-sand-border bg-sand-surface text-xs font-medium text-sand-text hover:bg-sand-surface-muted transition-colors shadow-2xs"
                >
                  <Github className="w-4 h-4 text-sand-moss" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-sand-border bg-sand-surface p-6 sm:p-8 shadow-xs">
              
              {successResponse ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-sand-moss/15 text-sand-moss flex items-center justify-center">
                    <MailCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-sand-text">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-sm text-sand-text-muted max-w-md mx-auto">
                    {successResponse}
                  </p>
                  <button
                    onClick={() => setSuccessResponse(null)}
                    type="button"
                    className="mt-4 px-5 py-2 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  {/* Anti-spam honeypot (hidden from human users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="hp_field">Leave this empty</label>
                    <input
                      type="text"
                      id="hp_field"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sender Name */}
                    <div className="space-y-1">
                      <label htmlFor="sender_name" className="text-xs font-semibold text-sand-text font-mono">
                        Your Full Name <span className="text-sand-amber">*</span>
                      </label>
                      <input
                        type="text"
                        id="sender_name"
                        name="sender_name"
                        value={formData.sender_name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text placeholder:text-sand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-sand-moss transition-colors"
                        aria-describedby="name-hint"
                      />
                    </div>

                    {/* Sender Email */}
                    <div className="space-y-1">
                      <label htmlFor="sender_email" className="text-xs font-semibold text-sand-text font-mono">
                        Work / Professional Email <span className="text-sand-amber">*</span>
                      </label>
                      <input
                        type="email"
                        id="sender_email"
                        name="sender_email"
                        value={formData.sender_email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="sarah@organization.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text placeholder:text-sand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-sand-moss transition-colors"
                        aria-describedby="email-hint"
                      />
                    </div>
                  </div>

                  {/* Organization & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organization */}
                    <div className="space-y-1">
                      <label htmlFor="sender_organization" className="text-xs font-semibold text-sand-text font-mono">
                        Organization / Company
                      </label>
                      <input
                        type="text"
                        id="sender_organization"
                        name="sender_organization"
                        value={formData.sender_organization}
                        onChange={handleChange}
                        placeholder="e.g. Acme HealthTech"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text placeholder:text-sand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-sand-moss transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1">
                      <label htmlFor="subject" className="text-xs font-semibold text-sand-text font-mono">
                        Subject / Opportunity <span className="text-sand-amber">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        minLength={3}
                        placeholder="Full-Stack / AI Engineer Opportunity"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text placeholder:text-sand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-sand-moss transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="space-y-1">
                    <label htmlFor="message" className="text-xs font-semibold text-sand-text font-mono">
                      Inquiry Details <span className="text-sand-amber">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      minLength={10}
                      placeholder="Share details regarding your role, engineering team, timeline, or technical inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-sm text-sand-text placeholder:text-sand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-sand-moss transition-colors"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-sand-moss text-white font-medium hover:bg-sand-moss-hover disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Queueing Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Recruiter Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
