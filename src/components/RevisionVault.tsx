import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  Printer,
  Edit3,
  Save,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { UGCQuestion } from '../types';
import { QuestionCard } from './QuestionCard';
import { sound } from '../utils/audio';

interface RevisionVaultProps {
  savedQuestions: UGCQuestion[];
  onToggleSave: (question: UGCQuestion) => void;
  onOpenTutor: (question: UGCQuestion) => void;
  onGoToPractice: () => void;
}

export const RevisionVault: React.FC<RevisionVaultProps> = ({
  savedQuestions,
  onToggleSave,
  onOpenTutor,
  onGoToPractice,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('geonet_user_notes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [activeEditingNoteId, setActiveEditingNoteId] = useState<string | null>(null);
  const [filterUnit, setFilterUnit] = useState<string>('All');

  const handleSaveNote = (questionId: string, noteText: string) => {
    sound.playClick();
    const updated = { ...userNotes, [questionId]: noteText };
    setUserNotes(updated);
    try {
      localStorage.setItem('geonet_user_notes', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setActiveEditingNoteId(null);
  };

  const handleCopyAll = () => {
    sound.playClick();
    const text = savedQuestions
      .map(
        (q, idx) =>
          `[Question ${idx + 1}] (${q.paper} - ${q.unit})\nTopic: ${q.topic}\n\nStem: ${q.questionStem}\n${
            q.assertion ? `Assertion (A): ${q.assertion}\nReason (R): ${q.reason}\n` : ''
          }${
            q.statements
              ? q.statements.map((s) => `${s.label}: ${s.text}`).join('\n') + '\n'
              : ''
          }Options:\n${q.options.map((o) => `(${o.id}) ${o.text}`).join('\n')}\nCorrect Answer: Option (${q.correctOptionId})\n\nExplanation:\n${q.correctExplanation}\n\nKey Takeaway:\n${q.keyConceptTakeaway}\n${
            userNotes[q.id] ? `My Personal Notes: ${userNotes[q.id]}\n` : ''
          }\n${'='.repeat(60)}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const unitsList = ['All', ...Array.from(new Set(savedQuestions.map((q) => q.unit)))];

  const filteredQuestions =
    filterUnit === 'All'
      ? savedQuestions
      : savedQuestions.filter((q) => q.unit === filterUnit);

  if (savedQuestions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8 text-teal-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Your Revision Vault is Empty</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            While practicing or generating questions, click the bookmark icon on any challenging question
            to save it here with your custom revision notes.
          </p>
        </div>
        <button
          onClick={onGoToPractice}
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition-all cursor-pointer inline-flex items-center space-x-2"
        >
          <span>Start Practicing Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Vault Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Revision Vault</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                {savedQuestions.length} Saved
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Personal high-yield repository for last-minute exam revision
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Copied Full Vault!' : 'Copy Vault Sheet'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter by Unit */}
      {unitsList.length > 2 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
            Filter by Unit:
          </span>
          {unitsList.map((unit) => (
            <button
              key={unit}
              onClick={() => {
                sound.playClick();
                setFilterUnit(unit);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterUnit === unit
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      )}

      {/* Questions List with Notes */}
      <div className="space-y-8">
        {filteredQuestions.map((q, idx) => {
          const note = userNotes[q.id] || '';
          const isEditingThisNote = activeEditingNoteId === q.id;

          return (
            <div key={q.id} className="space-y-3">
              <QuestionCard
                question={q}
                questionNumber={idx + 1}
                totalQuestions={filteredQuestions.length}
                isSaved={true}
                onToggleSave={onToggleSave}
                onOpenTutor={onOpenTutor}
                showExplanationDirectly={true}
              />

              {/* Personal Notes Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>My Revision Note & Mnemonic:</span>
                  </div>
                  {!isEditingThisNote && (
                    <button
                      onClick={() => setActiveEditingNoteId(q.id)}
                      className="text-xs text-slate-400 hover:text-teal-300 underline font-semibold cursor-pointer"
                    >
                      {note ? 'Edit Note' : '+ Add Note'}
                    </button>
                  )}
                </div>

                {isEditingThisNote ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      defaultValue={note}
                      id={`note-${q.id}`}
                      placeholder="Write your personal mnemonics, book references, or exam traps to remember..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setActiveEditingNoteId(null)}
                        className="px-3 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const el = document.getElementById(`note-${q.id}`) as HTMLTextAreaElement;
                          handleSaveNote(q.id, el ? el.value : '');
                        }}
                        className="px-3 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : note ? (
                  <p className="text-xs sm:text-sm text-amber-100/90 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80 whitespace-pre-line">
                    {note}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No personal note attached yet. Click &ldquo;+ Add Note&rdquo; to attach a formula or mnemonic.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
