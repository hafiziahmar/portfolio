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

const renderFormattedMessage = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const renderInline = (str: string) => {
      // Matches links [text](url), bold **text**, code `code`, and single asterisk/underscore *emphasis* or _emphasis_
      const parts = str.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`|\*[^*\n]+?\*|_[^_\n]+?_)/g);
      return parts.map((part, pIdx) => {
        if (!part) return null;

        // Link: [label](url)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a
              key={pIdx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sand-moss underline font-semibold hover:text-sand-moss-hover inline-flex items-center"
            >
              {linkMatch[1]}
            </a>
          );
        }

        // Bold: **text**
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={pIdx} className="font-bold text-sand-text underline-offset-2">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // Code: `code`
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          return (
            <code
              key={pIdx}
              className="font-mono text-xs px-1.5 py-0.5 rounded bg-sand-surface border border-sand-border text-sand-moss"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        // Emphasis / Single Asterisk / Underscore: *text* or _text_
        if (
          (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
          (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
        ) {
          return (
            <span key={pIdx} className="font-semibold text-sand-text italic">
              {part.slice(1, -1)}
            </span>
          );
        }

        return part;
      });
    };

    const trimmed = line.trim();

    // 1. Markdown Headings (e.g. ### Title) -> Rendered cleanly without raw ###
    if (trimmed.startsWith('#')) {
      const headingMatch = trimmed.match(/^#+\s*(.*)$/);
      if (headingMatch && headingMatch[1]) {
        return (
          <div key={lineIdx} className="font-bold text-xs sm:text-sm text-sand-text pt-2 pb-0.5 border-b border-sand-border/40">
            {renderInline(headingMatch[1])}
          </div>
        );
      }
    }

    // 2. Numbered Lists (e.g. 1. Item or 1) Item)
    const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (numMatch) {
      const [, num, itemContent] = numMatch;
      return (
        <div key={lineIdx} className="flex items-start space-x-2 ml-1 my-1">
          <span className="text-3xs font-mono font-bold text-sand-moss bg-sand-moss/10 px-1.5 py-0.5 rounded-sm shrink-0 select-none mt-0.5">
            {num}
          </span>
          <span className="text-xs sm:text-sm leading-relaxed flex-1">{renderInline(itemContent)}</span>
        </div>
      );
    }

    // 3. Bullet points (e.g. - item, * item, • item)
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || (trimmed.startsWith('* ') && !trimmed.startsWith('** '))) {
      return (
        <div key={lineIdx} className="flex items-start space-x-2 ml-2 my-1">
          <span className="text-sand-moss font-bold text-xs select-none">&bull;</span>
          <span className="text-xs sm:text-sm leading-relaxed flex-1">{renderInline(trimmed.slice(2))}</span>
        </div>
      );
    }

    if (!trimmed) {
      return <div key={lineIdx} className="h-2" />;
    }

    return (
      <p key={lineIdx} className="text-xs sm:text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });
};

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am Toph. I have full context on Hafizi Ahmar's professional background.\n\nHow may I help you?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What was his training in the KADA AI Full-Stack Fellowship?',
    'How does URUS prevent warehouse race conditions?',
    'What production platforms is Hafizi capable of building?',
    'Tell me about his automation & operations at NVC Group.',
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
                <div className="space-y-1">
                  {renderFormattedMessage(m.content)}
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
