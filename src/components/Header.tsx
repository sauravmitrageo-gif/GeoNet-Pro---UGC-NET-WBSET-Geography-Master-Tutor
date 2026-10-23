import React from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  MonitorCheck,
  Bookmark,
  Volume2,
  VolumeX,
  Award,
  Flame,
  Target,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { DailyGoal } from '../types';

export type ActiveTab = 'drill' | 'generator' | 'cbt' | 'syllabus' | 'vault' | 'analytics';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  stats: {
    correct: number;
    total: number;
    streak: number;
  };
  savedCount: number;
  dailyGoal: DailyGoal;
  onOpenDailyGoalModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  stats,
  savedCount,
  dailyGoal,
  onOpenDailyGoalModal,
}) => {
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'drill', label: 'Master Practice', icon: <Compass className="w-4 h-4" /> },
    { id: 'generator', label: 'AI 3-Q Generator', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'Gemini' },
    { id: 'cbt', label: 'NTA CBT Exam', icon: <MonitorCheck className="w-4 h-4" />, badge: 'Mock' },
    { id: 'syllabus', label: 'Syllabus & Units', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'vault', label: 'Revision Vault', icon: <Bookmark className="w-4 h-4" />, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'analytics', label: 'Study Analytics', icon: <BarChart3 className="w-4 h-4 text-emerald-400" />, badge: 'New' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('drill')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Compass className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
                  GeoNet Pro
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  UGC NET · WBSET
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Paper 2 (Geography) & Paper 1 Master Tutor
              </p>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-slate-800 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        item.badge === 'Gemini'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-teal-500/20 text-teal-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Daily Goal Circular Progress Bar */}
            {(() => {
              const radius = 12;
              const circumference = 2 * Math.PI * radius;
              const percentage = Math.min(
                100,
                Math.round((dailyGoal.todayPracticed / dailyGoal.target) * 100)
              );
              const strokeDashoffset = circumference - (percentage / 100) * circumference;
              const isGoalMet = dailyGoal.todayPracticed >= dailyGoal.target;

              return (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenDailyGoalModal();
                  }}
                  title={`Daily Goal: ${dailyGoal.todayPracticed}/${dailyGoal.target} solved (${percentage}%). Click to adjust target.`}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer group ${
                    isGoalMet
                      ? 'bg-amber-950/40 border-amber-500/50 hover:bg-amber-950/70 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-teal-500/50'
                  }`}
                >
                  {/* Circular SVG Ring */}
                  <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 32 32">
                      {/* Background Track */}
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        className="stroke-slate-700/60"
                        strokeWidth="3"
                        fill="transparent"
                      />
                      {/* Active Progress */}
                      <circle
                        cx="16"
                        cy="16"
                        r={radius}
                        className={`transition-all duration-500 ease-out ${
                          isGoalMet ? 'stroke-amber-400' : 'stroke-teal-400'
                        }`}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isGoalMet ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Target className="w-3 h-3 text-teal-400 group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                  </div>

                  {/* Text Badge */}
                  <div className="text-left font-mono leading-none hidden sm:block">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-white">
                        {dailyGoal.todayPracticed}
                      </span>
                      <span className="text-[10px] text-slate-400">/{dailyGoal.target}</span>
                    </div>
                    <span className="text-[9px] uppercase font-sans font-semibold tracking-wider text-slate-400 block mt-0.5">
                      {isGoalMet ? 'Goal Met' : 'Daily Goal'}
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* Streak Counter */}
            {stats.streak > 0 && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{stats.streak} Streak</span>
              </div>
            )}

            {/* Score / Accuracy Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>
                Score: <strong className="text-teal-300">{stats.correct}</strong>/{stats.total}
              </span>
              {stats.total > 0 && (
                <span className="text-[10px] text-slate-400 ml-1">
                  ({Math.round((stats.correct / stats.total) * 100)}%)
                </span>
              )}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-teal-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex flex-col items-center px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  active ? 'text-teal-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="mt-0.5">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
