import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  MonitorCheck,
  Bookmark,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  MessageSquare,
  Filter,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { UGCQuestion } from './types';
import { CURATED_QUESTIONS } from './data/curatedQuestions';
import { Header, ActiveTab } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { TopicGenerator } from './components/TopicGenerator';
import { CBTSimulator } from './components/CBTSimulator';
import { SyllabusBrowser } from './components/SyllabusBrowser';
import { RevisionVault } from './components/RevisionVault';
import { TutorChatDrawer } from './components/TutorChatDrawer';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('drill');
  const [allQuestions, setAllQuestions] = useState<UGCQuestion[]>(CURATED_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('All');

  // Generated questions state
  const [generatedQuestions, setGeneratedQuestions] = useState<UGCQuestion[]>([]);
  const [generatedTopicSummary, setGeneratedTopicSummary] = useState<string | null>(null);

  // Saved / Bookmarked questions
  const [savedQuestions, setSavedQuestions] = useState<UGCQuestion[]>(() => {
    try {
      const stored = localStorage.getItem('geonet_saved_questions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // User Stats (Score, Streak, Answers)
  const [userStats, setUserStats] = useState<{
    correct: number;
    total: number;
    streak: number;
  }>(() => {
    try {
      const stored = localStorage.getItem('geonet_user_stats');
      return stored ? JSON.parse(stored) : { correct: 0, total: 0, streak: 0 };
    } catch {
      return { correct: 0, total: 0, streak: 0 };
    }
  });

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('geonet_muted') === 'true';
    } catch {
      return false;
    }
  });

  // Tutor Chat Drawer
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorQuestionContext, setTutorQuestionContext] = useState<UGCQuestion | null>(null);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('geonet_saved_questions', JSON.stringify(savedQuestions));
    } catch {
      // Ignore
    }
  }, [savedQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem('geonet_user_stats', JSON.stringify(userStats));
    } catch {
      // Ignore
    }
  }, [userStats]);

  useEffect(() => {
    try {
      localStorage.setItem('geonet_muted', String(isMuted));
    } catch {
      // Ignore
    }
    sound.setMuted(isMuted);
  }, [isMuted]);

  // Filtered practice questions
  const filteredQuestions =
    selectedUnitFilter === 'All'
      ? allQuestions
      : allQuestions.filter((q) => q.unit.includes(selectedUnitFilter) || q.unit === selectedUnitFilter);

  const currentQ = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleToggleSave = (q: UGCQuestion) => {
    sound.playClick();
    setSavedQuestions((prev) => {
      const exists = prev.some((item) => item.id === q.id);
      if (exists) {
        return prev.filter((item) => item.id !== q.id);
      } else {
        return [q, ...prev];
      }
    });
  };

  const handleAnswerSubmit = (questionId: string, selectedOptionId: string, isCorrect: boolean) => {
    setUserStats((prev) => {
      const nextCorrect = isCorrect ? prev.correct + 1 : prev.correct;
      const nextTotal = prev.total + 1;
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      return { correct: nextCorrect, total: nextTotal, streak: nextStreak };
    });
  };

  const handleOpenTutor = (question: UGCQuestion) => {
    sound.playClick();
    setTutorQuestionContext(question);
    setIsTutorOpen(true);
  };

  const handleQuestionsGenerated = (questions: UGCQuestion[], topicSummary?: string) => {
    setGeneratedQuestions(questions);
    setGeneratedTopicSummary(topicSummary || null);
    // Add new questions to Master Practice bank as well
    setAllQuestions((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      const newItems = questions.filter((q) => !existingIds.has(q.id));
      return [...newItems, ...prev];
    });
  };

  const handleSelectTopicFromSyllabus = (
    topicTitle: string,
    unitTitle: string,
    paper: 'Paper 1' | 'Paper 2 (Geography)'
  ) => {
    setActiveTab('generator');
  };

  const handleFilterPracticeByUnit = (unitTitle: string) => {
    setSelectedUnitFilter(unitTitle);
    setCurrentQuestionIndex(0);
    setActiveTab('drill');
  };

  // Unique units for drill filter
  const unitFilterOptions = [
    'All',
    'Geomorphology',
    'Climatology',
    'Oceanography',
    'Environment',
    'Population & Settlement',
    'Economic Geography',
    'Geographic Thought',
    'Geographical Techniques',
    'India',
    'Paper 1',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        stats={userStats}
        savedCount={savedQuestions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: MASTER PRACTICE DRILL */}
        {activeTab === 'drill' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Action Bar & Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter by Unit:</span>
                </span>
                <select
                  value={selectedUnitFilter}
                  onChange={(e) => {
                    sound.playClick();
                    setSelectedUnitFilter(e.target.value);
                    setCurrentQuestionIndex(0);
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-400"
                >
                  {unitFilterOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'All' ? 'All Units (Comprehensive)' : opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => {
                    sound.playClick();
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1 ${
                    currentQuestionIndex === 0
                      ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="font-mono text-xs font-bold text-slate-300 px-2">
                  {currentQuestionIndex + 1} / {filteredQuestions.length}
                </span>

                <button
                  disabled={currentQuestionIndex >= filteredQuestions.length - 1}
                  onClick={() => {
                    sound.playClick();
                    setCurrentQuestionIndex((prev) =>
                      Math.min(filteredQuestions.length - 1, prev + 1)
                    );
                  }}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1 ${
                    currentQuestionIndex >= filteredQuestions.length - 1
                      ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white cursor-pointer'
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('generator')}
                  className="ml-2 px-3 py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Generate 3 on Custom Topic</span>
                </button>
              </div>
            </div>

            {/* Main Question Card */}
            {currentQ ? (
              <QuestionCard
                question={currentQ}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={filteredQuestions.length}
                onNext={() => {
                  if (currentQuestionIndex < filteredQuestions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }
                }}
                onAnswerSubmit={handleAnswerSubmit}
                isSaved={savedQuestions.some((sq) => sq.id === currentQ.id)}
                onToggleSave={handleToggleSave}
                onOpenTutor={handleOpenTutor}
              />
            ) : (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                No questions found for this filter. Try selecting &ldquo;All Units&rdquo;.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI 3-QUESTION GENERATOR (Gemini 3.8 Flash) */}
        {activeTab === 'generator' && (
          <TopicGenerator
            onQuestionsGenerated={handleQuestionsGenerated}
            savedQuestions={savedQuestions}
            onToggleSave={handleToggleSave}
            onOpenTutor={handleOpenTutor}
            currentGeneratedQuestions={generatedQuestions}
            topicSummary={generatedTopicSummary}
            onClearGenerated={() => {
              setGeneratedQuestions([]);
              setGeneratedTopicSummary(null);
            }}
          />
        )}

        {/* TAB 3: NTA CBT EXAM SIMULATOR */}
        {activeTab === 'cbt' && (
          <CBTSimulator
            questions={allQuestions.slice(0, 10)}
            onOpenTutor={handleOpenTutor}
            onExitCBT={() => setActiveTab('drill')}
          />
        )}

        {/* TAB 4: SYLLABUS BROWSER */}
        {activeTab === 'syllabus' && (
          <SyllabusBrowser
            onSelectTopicForGeneration={handleSelectTopicFromSyllabus}
            onFilterPracticeByUnit={handleFilterPracticeByUnit}
          />
        )}

        {/* TAB 5: REVISION VAULT */}
        {activeTab === 'vault' && (
          <RevisionVault
            savedQuestions={savedQuestions}
            onToggleSave={handleToggleSave}
            onOpenTutor={handleOpenTutor}
            onGoToPractice={() => setActiveTab('drill')}
          />
        )}
      </main>

      {/* Floating Action Button: Ask Professor */}
      <button
        onClick={() => {
          sound.playClick();
          setIsTutorOpen(true);
        }}
        className="fixed bottom-6 right-6 z-30 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer border border-teal-300/40"
      >
        <GraduationCap className="w-5 h-5" />
        <span className="hidden sm:inline">Ask AI Geography Professor</span>
      </button>

      {/* Slide-over Tutor Consultation Drawer */}
      <TutorChatDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        activeQuestion={tutorQuestionContext}
      />
    </div>
  );
}
