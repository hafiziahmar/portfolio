import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { api } from '../api/client';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am Hafizi's **AI CV Copilot**. I have full context on his clinical healthcare background, 42KL systems programming training, Project KADA fellowship, and the architectural design of his flagship **URUS Platform**.\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How does URUS prevent race conditions?',
    'Tell me about his clinical operations at NVC Australia.',
    'What are his Antigravity & Agentic AI skills?',
    'What was his training at 42KL Piscine?',
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    const newHistory: ChatEntry[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await api.askCopilot(textToSend, newHistory);
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages([
        ...newHistory,
        {
          role: 'assistant',
          content:
            "I encountered a temporary connection issue. You can still reach Hafizi directly via the **Recruiter Contact Queue** on this page!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-sand-surface h-full shadow-2xl border-l border-sand-border flex flex-col justify-between animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="AI CV Copilot"
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-sand-border flex items-center justify-between bg-sand-surface-muted">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sand-amber/15 text-sand-amber">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-sm font-bold text-sand-text">AI CV Copilot</h2>
                <span className="text-3xs font-mono px-1.5 py-0.5 rounded-sm bg-sand-moss text-white font-semibold">
                  LIVE
                </span>
              </div>
              <p className="text-2xs text-sand-text-muted">Ask anything about Hafizi's background & code</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-sand-text-muted hover:text-sand-text hover:bg-sand-surface transition-colors cursor-pointer"
            aria-label="Close Copilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="p-1.5 rounded-lg bg-sand-moss/10 text-sand-moss shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-sand-moss text-white rounded-br-xs'
                    : 'bg-sand-surface-muted text-sand-text border border-sand-border rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line space-y-1">
                  {m.content}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="p-1.5 rounded-lg bg-sand-amber/15 text-sand-amber shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-sand-text-muted">
              <Bot className="w-4 h-4 text-sand-moss animate-pulse" />
              <span>Analyzing CV context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-sand-border bg-sand-bg/50">
          <div className="text-3xs font-mono text-sand-text-muted mb-1.5 font-semibold uppercase">
            Suggested Prompts:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                className="text-2xs px-2.5 py-1 rounded-lg bg-sand-surface border border-sand-border text-sand-text hover:bg-sand-surface-muted hover:border-sand-moss transition-colors text-left cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-sand-border bg-sand-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a technical or background question..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-sand-border bg-sand-bg text-xs sm:text-sm text-sand-text placeholder:text-sand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-sand-moss"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-2.5 rounded-xl bg-sand-moss text-white hover:bg-sand-moss-hover disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
