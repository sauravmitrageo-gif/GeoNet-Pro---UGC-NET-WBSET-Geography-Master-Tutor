import React, { useState, useEffect } from 'react';
import {
  Clock,
  User,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  AlertTriangle,
  Play,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { UGCQuestion } from '../types';
import { sound } from '../utils/audio';

interface CBTSimulatorProps {
  questions: UGCQuestion[];
  onOpenTutor: (question: UGCQuestion) => void;
  onExitCBT: () => void;
}

type QuestionStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked_review' | 'answered_marked_review';

export const CBTSimulator: React.FC<CBTSimulatorProps> = ({
  questions,
  onOpenTutor,
  onExitCBT,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(questions.length * 120); // 2 min per question
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [reviewModeIndex, setReviewModeIndex] = useState<number | null>(null);

  // Initialize statuses
  useEffect(() => {
    const initialStatuses: Record<string, QuestionStatus> = {};
    questions.forEach((q, idx) => {
      initialStatuses[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });
    setStatuses(initialStatuses);
  }, [questions]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Sync selectedOption when currentIndex changes
  useEffect(() => {
    const currentQ = questions[currentIndex];
    if (currentQ) {
      setSelectedOption(answers[currentQ.id] || null);

      setStatuses((prev) => {
        const currentStatus = prev[currentQ.id];
        if (currentStatus === 'not_visited') {
          return { ...prev, [currentQ.id]: 'not_answered' };
        }
        return prev;
      });
    }
  }, [currentIndex, questions, answers]);

  const currentQ = questions[currentIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId: string) => {
    sound.playClick();
    setSelectedOption(optionId);
  };

  const handleSaveAndNext = () => {
    if (!currentQ) return;
    sound.playClick();

    if (selectedOption) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));
      setStatuses((prev) => ({ ...prev, [currentQ.id]: 'answered' }));
    } else {
      setStatuses((prev) => ({ ...prev, [currentQ.id]: 'not_answered' }));
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSaveAndMarkForReview = () => {
    if (!currentQ) return;
    sound.playClick();

    if (selectedOption) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));
      setStatuses((prev) => ({ ...prev, [currentQ.id]: 'answered_marked_review' }));
    } else {
      setStatuses((prev) => ({ ...prev, [currentQ.id]: 'marked_review' }));
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQ) return;
    sound.playClick();
    setStatuses((prev) => ({ ...prev, [currentQ.id]: 'marked_review' }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    sound.playClick();
    setSelectedOption(null);
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setStatuses((prev) => ({ ...prev, [currentQ.id]: 'not_answered' }));
  };

  const handleJumpToQuestion = (index: number) => {
    sound.playClick();
    setCurrentIndex(index);
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    setShowSubmitConfirm(false);
    sound.playFanfare();
  };

  // Score Calculation
  const totalQuestions = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q) => {
    const userAns = answers[q.id];
    if (!userAns) {
      unattemptedCount++;
    } else if (userAns === q.correctOptionId) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const totalScore = correctCount * 2;
  const maxScore = totalQuestions * 2;
  const accuracyPercentage =
    totalQuestions - unattemptedCount > 0
      ? Math.round((correctCount / (totalQuestions - unattemptedCount)) * 100)
      : 0;

  // Counts for palette
  const answeredCount = Object.values(statuses).filter(
    (s) => s === 'answered' || s === 'answered_marked_review'
  ).length;
  const notAnsweredCount = Object.values(statuses).filter((s) => s === 'not_answered').length;
  const markedReviewCount = Object.values(statuses).filter(
    (s) => s === 'marked_review' || s === 'answered_marked_review'
  ).length;
  const notVisitedCount = questions.length - Object.keys(statuses).length;

  if (isSubmitted) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Exam Scorecard Header */}
        <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold mb-2">
                <Award className="w-4 h-4" />
                <span>NTA CBT Result & Performance Audit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Exam Performance Report Card
              </h2>
              <p className="text-sm text-slate-300">
                UGC NET & WBSET Geography Mock Simulation
              </p>
            </div>

            <button
              onClick={onExitCBT}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
            >
              Exit to Master Practice
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Total Score</span>
              <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">
                {totalScore} <span className="text-sm text-slate-400">/ {maxScore}</span>
              </div>
              <span className="text-[11px] text-teal-400 font-semibold">+2 per correct</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Accuracy Rate</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                {accuracyPercentage}%
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">of attempted</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Correct Answers</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
                {correctCount}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {Math.round((correctCount / totalQuestions) * 100)}% of total
              </span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Incorrect / Skipped</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">
                {incorrectCount} / {unattemptedCount}
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">0 negative mark</span>
            </div>
          </div>
        </div>

        {/* Detailed Question Review with Step-by-Step Debunker */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <span>Comprehensive Question-by-Question Review & Debunker</span>
            </h3>
            <span className="text-xs text-slate-400">
              Click any question to view its detailed option breakdown
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAns = answers[q.id];
              const isQCorrect = userAns === q.correctOptionId;
              const isSkipped = !userAns;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 font-mono text-xs font-bold text-slate-300">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-teal-300">{q.unit}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{q.topic}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isSkipped ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold">
                          Not Attempted
                        </span>
                      ) : isQCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct (+2)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect (0)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Stem */}
                  <div className="text-sm sm:text-base font-semibold text-slate-100">
                    {q.questionStem}
                  </div>

                  {/* Assertion-Reasoning Box if present */}
                  {q.format === 'assertion_reason' && (
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                        <strong className="text-amber-400 font-mono">(A): </strong>
                        <span className="text-slate-200">{q.assertion}</span>
                      </div>
                      <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                        <strong className="text-cyan-400 font-mono">(R): </strong>
                        <span className="text-slate-200">{q.reason}</span>
                      </div>
                    </div>
                  )}

                  {/* Candidate Answer vs Correct Answer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div
                      className={`p-3 rounded-xl border ${
                        isSkipped
                          ? 'bg-slate-800/40 border-slate-700 text-slate-400'
                          : isQCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      <span className="block font-bold uppercase text-[10px] tracking-wider mb-1">
                        Your Marked Option:
                      </span>
                      <span>
                        {userAns
                          ? `Option (${userAns}): ${q.options.find((o) => o.id === userAns)?.text}`
                          : 'None (Skipped)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border bg-emerald-950/40 border-emerald-500/50 text-emerald-200">
                      <span className="block font-bold uppercase text-[10px] tracking-wider mb-1 text-emerald-400">
                        NTA Official Key:
                      </span>
                      <span>
                        Option ({q.correctOptionId}):{' '}
                        {q.options.find((o) => o.id === q.correctOptionId)?.text}
                      </span>
                    </div>
                  </div>

                  {/* Academic Explanation */}
                  <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <div className="font-bold text-teal-300 mb-1 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Detailed Academic Explanation:</span>
                    </div>
                    <p className="whitespace-pre-line font-normal">{q.correctExplanation}</p>
                  </div>

                  {/* Debunker List */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Option Debunker & NTA Distractor Traps:</span>
                    </div>
                    {q.optionDebunker.map((item) => (
                      <div
                        key={item.optionId}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-4 h-4 rounded text-[10px] font-mono font-bold flex items-center justify-center ${
                              item.verdict === 'Correct'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {item.optionId}
                          </span>
                          <span className="font-semibold text-slate-200">
                            Option ({item.optionId}) - {item.verdict}
                          </span>
                        </div>
                        <p className="text-slate-400 pl-6">{item.explanation}</p>
                        {item.examTrap && (
                          <p className="text-amber-300/90 pl-6 font-mono text-[11px]">
                            Trap: {item.examTrap}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Ask Tutor button for this question */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onOpenTutor(q)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
                    >
                      Discuss this question with AI Geography Professor &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
      {/* NTA Exam Header Bar */}
      <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
            NTA UGC NET / WBSET Computer-Based Test (CBT) Interface
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Paper 2: Geography & Paper 1 Mock
          </h2>
        </div>

        {/* Timer Box */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-amber-500/40 px-4 py-2 rounded-xl text-amber-300">
          <Clock className="w-5 h-5 animate-pulse" />
          <div className="text-left font-mono">
            <span className="text-[10px] block uppercase font-bold text-slate-400">Time Left</span>
            <span className="text-base sm:text-lg font-black">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Question Pane, Right Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
        {/* Left Pane: Question & Options (8 cols on lg) */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="space-y-6">
            {/* Question Info Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-md bg-teal-500/20 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
                  Question No. {currentIndex + 1}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">{currentQ?.unit}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="text-emerald-400">+2.00</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">-0.00</span>
              </div>
            </div>

            {/* Question Content */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {currentQ?.questionStem}
              </h3>

              {/* Assertion & Reason */}
              {currentQ?.format === 'assertion_reason' && (
                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                    <strong className="text-amber-400 font-mono font-bold mr-2">Assertion (A):</strong>
                    <span className="text-slate-200">{currentQ.assertion}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                    <strong className="text-cyan-400 font-mono font-bold mr-2">Reason (R):</strong>
                    <span className="text-slate-200">{currentQ.reason}</span>
                  </div>
                </div>
              )}

              {/* Multi-Statement */}
              {currentQ?.format === 'multi_statement' && currentQ.statements && (
                <div className="space-y-2 pt-1">
                  {currentQ.statements.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 flex items-start space-x-2.5"
                    >
                      <span className="text-teal-400 font-mono font-bold">{s.label}:</span>
                      <span>{s.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Matching */}
              {currentQ?.format === 'matching' && currentQ.list1 && currentQ.list2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="font-bold text-amber-400 uppercase tracking-wider mb-2">
                      {currentQ.list1Title || 'List I'}
                    </div>
                    {currentQ.list1.map((item) => (
                      <div key={item.code} className="flex space-x-2 text-slate-200">
                        <span className="font-mono font-bold text-amber-300">{item.code}.</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <div className="font-bold text-cyan-400 uppercase tracking-wider mb-2">
                      {currentQ.list2Title || 'List II'}
                    </div>
                    {currentQ.list2.map((item) => (
                      <div key={item.code} className="flex space-x-2 text-slate-200">
                        <span className="font-mono font-bold text-cyan-300">{item.code}.</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options Radio List */}
              <div className="space-y-2.5 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Option:
                </p>
                {currentQ?.options.map((opt) => {
                  const isChecked = selectedOption === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-teal-950/60 border-teal-500 text-teal-100 ring-2 ring-teal-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cbt-opt"
                        checked={isChecked}
                        onChange={() => handleOptionSelect(opt.id)}
                        className="mt-1 w-4 h-4 text-teal-500 focus:ring-teal-400 border-slate-700 bg-slate-900"
                      />
                      <span className="font-mono font-bold text-xs text-slate-400 w-4">
                        ({opt.id})
                      </span>
                      <span className="text-sm flex-1 leading-snug">{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Control Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Save & Next
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                Clear Response
              </button>

              <button
                type="button"
                onClick={handleSaveAndMarkForReview}
                className="px-3.5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Save & Mark for Review
              </button>

              <button
                type="button"
                onClick={handleMarkForReviewAndNext}
                className="px-3.5 py-2.5 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Mark for Review & Next
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className={`p-2.5 rounded-xl border ${
                  currentIndex === 0
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className={`p-2.5 rounded-xl border ${
                  currentIndex === questions.length - 1
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white cursor-pointer'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Candidate Info & Question Palette (4 cols on lg) */}
        <div className="lg:col-span-4 bg-slate-950 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Candidate Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <User className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-white">Saurav Mitra</div>
                <div className="text-slate-400 font-mono text-[11px]">Roll: 2026-GEO-8842</div>
                <div className="text-teal-400 font-semibold text-[10px]">Subject: Geography (080)</div>
              </div>
            </div>

            {/* Question Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {answeredCount}
                </span>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {notAnsweredCount}
                </span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {markedReviewCount}
                </span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-700">
                  {notVisitedCount}
                </span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Question Palette Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Question Palette
              </h4>
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const status = statuses[q.id] || 'not_visited';
                  const isCurrent = idx === currentIndex;

                  let colorClass = 'bg-slate-800 text-slate-400 border border-slate-700';
                  if (status === 'answered') {
                    colorClass = 'bg-emerald-600 text-white border-emerald-500 font-bold';
                  } else if (status === 'not_answered') {
                    colorClass = 'bg-rose-600 text-white border-rose-500 font-bold';
                  } else if (status === 'marked_review') {
                    colorClass = 'bg-purple-600 text-white border-purple-500 font-bold';
                  } else if (status === 'answered_marked_review') {
                    colorClass = 'bg-purple-700 text-white border-purple-400 ring-2 ring-emerald-400 font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-lg font-mono text-xs flex items-center justify-center transition-all cursor-pointer ${colorClass} ${
                        isCurrent ? 'ring-2 ring-teal-300 scale-105' : 'hover:opacity-90'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Test CTA */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
            >
              Submit Exam & View Report
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Ready to Submit Examination?</h3>
              <p className="text-xs text-slate-400">
                You will immediately receive your official scorecard, percentile rating, and complete
                step-by-step option debunker for every question.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Questions:</span>
                <span className="font-bold text-white">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Answered:</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unanswered / Marked:</span>
                <span className="font-bold text-rose-400">{totalQuestions - answeredCount}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
