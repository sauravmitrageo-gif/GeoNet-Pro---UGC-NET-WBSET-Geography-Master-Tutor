import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Loader2,
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Bot,
  User,
} from 'lucide-react';
import { UGCQuestion } from '../types';
import { sound } from '../utils/audio';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TutorChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeQuestion: UGCQuestion | null;
}

export const TutorChatDrawer: React.FC<TutorChatDrawerProps> = ({
  isOpen,
  onClose,
  activeQuestion,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting or context when a question is passed
  useEffect(() => {
    if (activeQuestion) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I am your Senior UGC NET & WBSET Geography Professor. I have reviewed the active question on **"${activeQuestion.topic}"** (${activeQuestion.unit}).\n\nHow can I help you master this concept? You can ask me to break down why any distractor was eliminated, explain the underlying theory in simpler terms, or provide an exam mnemonic!`,
        },
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: `Welcome to the UGC NET Geography Consultation Desk! Feel free to ask any conceptual doubts regarding Paper 2 (Geomorphology, Climatology, Thought, Techniques, India, etc.) or Paper 1 (Research, Teaching, Indian Logic).`,
        },
      ]);
    }
  }, [activeQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customQuery?: string) => {
    const queryText = customQuery || input;
    if (!queryText.trim() || loading) return;

    sound.playClick();
    const userMsg: Message = { role: 'user', content: queryText.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionContext: activeQuestion
            ? {
                topic: activeQuestion.topic,
                unit: activeQuestion.unit,
                questionStem: activeQuestion.questionStem,
                assertion: activeQuestion.assertion,
                reason: activeQuestion.reason,
                correctOptionId: activeQuestion.correctOptionId,
                correctExplanation: activeQuestion.correctExplanation,
                options: activeQuestion.options,
              }
            : null,
          userQuery: queryText.trim(),
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Apologies, I could not generate a response. Please try again.',
        },
      ]);
      sound.playClick();
    } catch (err: any) {
      console.error('Error asking tutor:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error connecting to the academic server. Please try again or rephrase your question.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain the difference in simpler terms',
    'Why is Option 2 wrong here?',
    'Give me an exam mnemonic for this',
    'What PYQ traps are common in this topic?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center space-x-2">
                <span>AI Geography Professor</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                UGC NET & WBSET Concept Clarification Desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Mini-Context Pill if active */}
        {activeQuestion && (
          <div className="bg-slate-800/70 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-teal-400">Active Topic:</span>
              <span className="text-slate-300 truncate">{activeQuestion.topic}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-700 text-[10px] font-mono text-slate-300">
              Q-Context Linked
            </span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-tl-none flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Professor is consulting academic literature...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Professor about any concept, option, or doubt..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`p-3 rounded-xl font-bold transition-all cursor-pointer ${
                loading || !input.trim()
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
