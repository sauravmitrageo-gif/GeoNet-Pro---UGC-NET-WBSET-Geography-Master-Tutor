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
} from 'lucide-react';
import { sound } from '../utils/audio';

export type ActiveTab = 'drill' | 'generator' | 'cbt' | 'syllabus' | 'vault';

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
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  stats,
  savedCount,
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
