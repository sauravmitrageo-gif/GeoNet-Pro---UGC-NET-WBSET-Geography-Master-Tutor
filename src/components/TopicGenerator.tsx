import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  BookOpen,
  Layers,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Flame,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { UGCQuestion } from '../types';
import { SYLLABUS_UNITS, TOPIC_PRESETS } from '../data/syllabus';
import { QuestionCard } from './QuestionCard';
import { sound } from '../utils/audio';

interface TopicGeneratorProps {
  onQuestionsGenerated: (questions: UGCQuestion[], topicSummary?: string) => void;
  savedQuestions: UGCQuestion[];
  onToggleSave: (question: UGCQuestion) => void;
  onOpenTutor: (question: UGCQuestion) => void;
  currentGeneratedQuestions: UGCQuestion[];
  topicSummary: string | null;
  onClearGenerated: () => void;
}

export const TopicGenerator: React.FC<TopicGeneratorProps> = ({
  onQuestionsGenerated,
  savedQuestions,
  onToggleSave,
  onOpenTutor,
  currentGeneratedQuestions,
  topicSummary,
  onClearGenerated,
}) => {
  const [topic, setTopic] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('Unit I: Geomorphology');
  const [paper, setPaper] = useState<'Paper 2 (Geography)' | 'Paper 1'>('Paper 2 (Geography)');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    'Calibrating to latest NTA NET / WBSET standard...',
    'Drafting Assertion-Reasoning & Multi-Statement items...',
    'Validating distractor traps & theoretical proofs...',
    'Synthesizing step-by-step Option Debunker...',
  ];

  const handleGenerate = async (targetTopic?: string, targetUnit?: string, targetPaper?: 'Paper 2 (Geography)' | 'Paper 1') => {
    const activeTopic = targetTopic || topic;
    const activeUnit = targetUnit || selectedUnit;
    const activePaper = targetPaper || paper;

    if (!activeTopic.trim()) {
      setError('Please enter a topic or unit name to generate questions.');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep(0);
    sound.playClick();

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic.trim(),
          unit: activeUnit,
          paper: activePaper,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      clearInterval(interval);

      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        // Format incoming questions to full UGCQuestion
        const formatted: UGCQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || `gen-${Date.now()}-${idx}`,
          topic: activeTopic,
          unit: activeUnit,
          paper: activePaper,
          format: q.format || 'assertion_reason',
          questionStem: q.questionStem || q.question || '',
          assertion: q.assertion,
          reason: q.reason,
          statements: q.statements,
          list1Title: q.list1Title,
          list1: q.list1,
          list2Title: q.list2Title,
          list2: q.list2,
          options: q.options || [],
          correctOptionId: String(q.correctOptionId || '1'),
          correctExplanation: q.correctExplanation || '',
          optionDebunker: q.optionDebunker || [],
          keyConceptTakeaway: q.keyConceptTakeaway || '',
          difficulty: 'High-Level (Latest Pattern)',
        }));

        onQuestionsGenerated(formatted, data.topicSummary);
        sound.playFanfare();
      } else {
        throw new Error('No questions returned by model.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Error generating questions:', err);
      setError(err.message || 'Failed to generate questions. Please verify your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: (typeof TOPIC_PRESETS)[0]) => {
    setTopic(preset.title);
    setSelectedUnit(preset.unit);
    setPaper(preset.paper);
    handleGenerate(preset.title, preset.unit, preset.paper);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/80 to-slate-900 border border-teal-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NTA UGC NET & WBSET Question Architect</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Generate 3 High-Level Questions on Any Topic
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Enter any syllabus concept, theory, scholar, or model. The tutor constructs 3 rigorous questions
            (including statement-based and assertion-reasoning) with full academic explanations and
            distractor debunkers.
          </p>
        </div>
      </div>

      {/* Input Form Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Paper Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Examination Paper
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPaper('Paper 2 (Geography)');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  paper === 'Paper 2 (Geography)'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paper 2: Geography
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPaper('Paper 1');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  paper === 'Paper 1'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paper 1: General
              </button>
            </div>
          </div>

          {/* Unit Selector */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Syllabus Unit / Domain
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-400 transition-colors"
            >
              {SYLLABUS_UNITS.filter((u) => u.paper === paper).map((unit) => (
                <option key={unit.id} value={`Unit ${unit.unitNumber}: ${unit.title}`}>
                  Unit {unit.unitNumber}: {unit.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Specific Topic, Concept, or Scholar
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleGenerate();
                }
              }}
              placeholder="e.g. Davis vs Penck cycle of erosion, Koppen BShw/Cwg, Mackinder Heartland, Nearest Neighbour Analysis Rn..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-32 py-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
            />
            <button
              disabled={loading || !topic.trim()}
              onClick={() => handleGenerate()}
              className={`absolute right-2 top-2 bottom-2 px-5 rounded-lg font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer ${
                loading || !topic.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate 3 Qs</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Topic Presets */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>High-Yield NTA Examination Presets (1-Click Drill):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPIC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 text-xs text-slate-300 hover:text-white transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 group-hover:scale-125 transition-transform" />
                <span className="font-medium">{preset.title}</span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Generation Notice: </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Animated Loading Progress State */}
        {loading && (
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-teal-500/30 text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 mx-auto rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
              <Compass className="w-6 h-6 text-teal-300 animate-spin" />
            </div>
            <div>
              <h4 className="text-base font-bold text-teal-200">
                Crafting NTA Standard Questions
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
                {loadingMessages[loadingStep]}
              </p>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 w-2/3 animate-ping" />
            </div>
          </div>
        )}
      </div>

      {/* Generated Questions Output Section */}
      {currentGeneratedQuestions.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Output Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  3 High-Level Questions Generated
                </h3>
                <p className="text-xs text-slate-400">
                  Ready for interactive practice with full option debunking.
                </p>
              </div>
            </div>

            <button
              onClick={onClearGenerated}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear / Generate Another</span>
            </button>
          </div>

          {/* Topic Summary */}
          {topicSummary && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">
                  High-Yield Concept Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {topicSummary}
                </p>
              </div>
            </div>
          )}

          {/* Question Cards List */}
          <div className="space-y-6">
            {currentGeneratedQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                questionNumber={idx + 1}
                totalQuestions={currentGeneratedQuestions.length}
                isSaved={savedQuestions.some((sq) => sq.id === q.id)}
                onToggleSave={onToggleSave}
                onOpenTutor={onOpenTutor}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
