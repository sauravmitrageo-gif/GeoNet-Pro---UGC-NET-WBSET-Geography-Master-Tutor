import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { UGCQuestion } from '../types';
import { sound } from '../utils/audio';

interface QuestionCardProps {
  question: UGCQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext?: () => void;
  onAnswerSubmit?: (questionId: string, selectedOptionId: string, isCorrect: boolean) => void;
  isSaved?: boolean;
  onToggleSave?: (question: UGCQuestion) => void;
  onOpenTutor?: (question: UGCQuestion) => void;
  userAnswer?: string | null;
  showExplanationDirectly?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onAnswerSubmit,
  isSaved = false,
  onToggleSave,
  onOpenTutor,
  userAnswer = null,
  showExplanationDirectly = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(userAnswer);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(
    Boolean(userAnswer) || showExplanationDirectly
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [activeDebunkTab, setActiveDebunkTab] = useState<'all' | 'incorrect_only'>('all');

  const isCorrect = selectedOption === question.correctOptionId;

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedOption(optId);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    const correct = selectedOption === question.correctOptionId;
    if (correct) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
    if (onAnswerSubmit) {
      onAnswerSubmit(question.id, selectedOption, correct);
    }
  };

  const handleCopy = () => {
    const text = `[UGC NET / WBSET ${question.paper} - ${question.unit}]\nTopic: ${question.topic}\n\nQuestion: ${question.questionStem}\n${
      question.assertion ? `(A): ${question.assertion}\n(R): ${question.reason}\n` : ''
    }${
      question.statements
        ? question.statements.map((s) => `${s.label}: ${s.text}`).join('\n') + '\n'
        : ''
    }\nOptions:\n${question.options.map((o) => `(${o.id}) ${o.text}`).join('\n')}\n\nCorrect Answer: Option (${question.correctOptionId})\n\nExplanation:\n${question.correctExplanation}\n\nKey Takeaway:\n${question.keyConceptTakeaway}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Question Header & Meta Bar */}
      <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono text-xs font-bold">
            Q{questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-700 text-slate-300">
            {question.paper}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs font-medium text-slate-300 hidden sm:inline truncate max-w-[200px] md:max-w-[300px]">
            {question.unit}
          </span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {question.format === 'assertion_reason'
              ? 'Assertion-Reason'
              : question.format === 'multi_statement'
              ? 'Multi-Statement'
              : question.format === 'matching'
              ? 'Match List I & II'
              : 'Conceptual'}
          </span>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(question)}
              title={isSaved ? 'Remove from Revision Vault' : 'Save to Revision Vault'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy question & explanation"
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Topic Title */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400">
          <GraduationCap className="w-4 h-4" />
          <span>Topic: {question.topic}</span>
        </div>

        {/* Question Stem */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
          {question.questionStem}
        </h3>

        {/* 1. Format: Assertion & Reason */}
        {question.format === 'assertion_reason' && (
          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-inner flex items-start space-x-3">
              <span className="flex-shrink-0 px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-extrabold">
                Assertion (A)
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {question.assertion}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-inner flex items-start space-x-3">
              <span className="flex-shrink-0 px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-extrabold">
                Reason (R)
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {question.reason}
              </p>
            </div>
          </div>
        )}

        {/* 2. Format: Multi-Statement */}
        {question.format === 'multi_statement' && question.statements && (
          <div className="space-y-2.5 pt-1">
            {question.statements.map((stmt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70 flex items-start space-x-3"
              >
                <span className="flex-shrink-0 px-2 py-0.5 rounded bg-slate-700 text-teal-300 font-mono text-xs font-bold">
                  {stmt.label}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">{stmt.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* 3. Format: Match List I with List II */}
        {question.format === 'matching' && question.list1 && question.list2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* List I */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                {question.list1Title || 'List I'}
              </h4>
              <div className="space-y-2">
                {question.list1.map((item) => (
                  <div key={item.code} className="flex items-start space-x-2 text-sm text-slate-200">
                    <span className="font-mono font-bold text-amber-300 w-6 flex-shrink-0">
                      {item.code}.
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* List II */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                {question.list2Title || 'List II'}
              </h4>
              <div className="space-y-2">
                {question.list2.map((item) => (
                  <div key={item.code} className="flex items-start space-x-2 text-sm text-slate-200">
                    <span className="font-mono font-bold text-cyan-300 w-6 flex-shrink-0">
                      {item.code}.
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select the correct option:
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isThisCorrect = option.id === question.correctOptionId;

              let style = 'bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';
              if (isSubmitted) {
                if (isThisCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-emerald-900/30';
                } else if (isSelected && !isThisCorrect) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-rose-900/30';
                } else {
                  style = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-teal-950/70 border-teal-400 text-teal-100 ring-2 ring-teal-500/40';
              }

              return (
                <button
                  key={option.id}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3.5 group cursor-pointer ${style}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 transition-colors ${
                      isSubmitted
                        ? isThisCorrect
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                        : isSelected
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    {option.id}
                  </span>
                  <div className="flex-1 text-sm sm:text-base pt-0.5 leading-snug">
                    {option.text}
                  </div>
                  {isSubmitted && (
                    <div className="flex-shrink-0 pt-0.5">
                      {isThisCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submission / Evaluation CTA */}
        {!isSubmitted ? (
          <div className="pt-2 flex justify-end">
            <button
              disabled={!selectedOption}
              onClick={handleSubmit}
              className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center space-x-2 transition-all ${
                selectedOption
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-teal-500/25 cursor-pointer hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>Lock & Check Answer</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* RESULT BANNER & DETAILED OPTION DEBUNKER */
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-fadeIn">
            {/* Status Feedback Banner */}
            <div
              className={`p-4 rounded-xl flex items-center justify-between border ${
                isCorrect
                  ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-900/30 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    {isCorrect ? 'Correct! Outstanding Reasoning' : 'Incorrect Option Marked'}
                  </h4>
                  <p className="text-xs opacity-90">
                    Correct Answer is <strong className="font-bold underline">Option ({question.correctOptionId})</strong>
                  </p>
                </div>
              </div>

              {onNext && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onNext();
                  }}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Detailed Academic Justification */}
            <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
              <div className="flex items-center space-x-2 text-teal-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step-by-Step Academic Justification</span>
              </div>
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                {question.correctExplanation}
              </div>
            </div>

            {/* STEP-BY-STEP OPTION DEBUNKER (Why the others are INCORRECT) */}
            <div className="bg-slate-800/90 rounded-xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-800 px-5 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Option Debunker: Why the Incorrect Options are False</span>
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setActiveDebunkTab('all')}
                    className={`px-2 py-1 rounded ${
                      activeDebunkTab === 'all'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Options
                  </button>
                  <button
                    onClick={() => setActiveDebunkTab('incorrect_only')}
                    className={`px-2 py-1 rounded ${
                      activeDebunkTab === 'incorrect_only'
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Traps & Distractors Only
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {question.optionDebunker
                  .filter((item) =>
                    activeDebunkTab === 'incorrect_only' ? item.verdict === 'Incorrect' : true
                  )
                  .map((item) => {
                    const isRightOpt = item.verdict === 'Correct';
                    const targetOption = question.options.find((o) => o.id === item.optionId);

                    return (
                      <div
                        key={item.optionId}
                        className={`p-3.5 rounded-lg border text-xs sm:text-sm space-y-1.5 ${
                          isRightOpt
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-5 h-5 rounded font-mono font-bold flex items-center justify-center text-xs ${
                                isRightOpt ? 'bg-emerald-500 text-white' : 'bg-rose-500/30 text-rose-300'
                              }`}
                            >
                              {item.optionId}
                            </span>
                            <span className="font-bold text-slate-200">
                              Option ({item.optionId}): {targetOption?.text}
                            </span>
                          </div>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              isRightOpt
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {item.verdict}
                          </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed pl-7">{item.explanation}</p>

                        {item.examTrap && (
                          <div className="ml-7 mt-2 p-2 rounded bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs flex items-start space-x-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-amber-300">NTA Trap Alert: </strong>
                              {item.examTrap}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* KEY CONCEPT TAKEAWAY / EXAM CHEAT-SHEET */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/40 flex items-start space-x-3 shadow-lg">
              <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  Key Concept Takeaway (Exam Memory Anchor)
                </h4>
                <p className="text-xs sm:text-sm text-amber-100 font-mono leading-relaxed">
                  {question.keyConceptTakeaway}
                </p>
              </div>
            </div>

            {/* Tutor Consultation Drawer Trigger */}
            {onOpenTutor && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onOpenTutor(question)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Ask AI Geography Professor about this Question</span>
                </button>

                {onNext && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onNext();
                    }}
                    className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
                  >
                    <span>Proceed to Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
