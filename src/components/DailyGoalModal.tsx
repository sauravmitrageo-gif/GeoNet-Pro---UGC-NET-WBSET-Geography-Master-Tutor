import React, { useState } from 'react';
import {
  Target,
  X,
  CheckCircle2,
  Sparkles,
  Trophy,
  RotateCcw,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { DailyGoal } from '../types';
import { sound } from '../utils/audio';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: DailyGoal;
  onUpdateDailyGoal: (newTarget: number) => void;
  onResetTodayProgress: () => void;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  isOpen,
  onClose,
  dailyGoal,
  onUpdateDailyGoal,
  onResetTodayProgress,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<number>(dailyGoal.target);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const presets = [
    { count: 5, label: 'Sprint Revision', time: '~10 mins', desc: 'Quick daily recall' },
    { count: 10, label: 'Standard Drill', time: '~20 mins', desc: 'Recommended for NET / SET', isRecommended: true },
    { count: 15, label: 'Deep Master', time: '~30 mins', desc: 'Thorough option debunking' },
    { count: 25, label: 'JRF Intensifier', time: '~50 mins', desc: 'Mock test pacing' },
  ];

  const percentage = Math.min(100, Math.round((dailyGoal.todayPracticed / dailyGoal.target) * 100));
  const isGoalAchieved = dailyGoal.todayPracticed >= dailyGoal.target;
  const remaining = Math.max(0, dailyGoal.target - dailyGoal.todayPracticed);

  // Large circular progress parameters
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleSave = () => {
    sound.playClick();
    onUpdateDailyGoal(selectedTarget);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-scaleUp">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
                <span>Daily Practice Goal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Target Setter
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Consistent daily solving guarantees UGC NET & WBSET mastery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular Progress & Today's Metric Display */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* Animated Circular Gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              {/* Background Track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Active Progress */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  isGoalAchieved ? 'stroke-amber-400' : 'stroke-teal-400'
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              {isGoalAchieved ? (
                <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
              ) : (
                <Target className="w-5 h-5 text-teal-400" />
              )}
              <span className="text-lg font-black text-white font-mono mt-0.5">
                {dailyGoal.todayPracticed}
                <span className="text-xs text-slate-400 font-sans">/{dailyGoal.target}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Today's Summary Text */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today&apos;s Status:
              </span>
              {isGoalAchieved ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center space-x-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  <span>Goal Achieved!</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold">
                  In Progress
                </span>
              )}
            </div>

            <p className="text-sm text-slate-200">
              {isGoalAchieved ? (
                <span className="text-emerald-300 font-medium">
                  Outstanding discipline! You met today&apos;s target of {dailyGoal.target} questions. Keep going to build your streak.
                </span>
              ) : (
                <span>
                  You have solved <strong className="text-white font-bold">{dailyGoal.todayPracticed}</strong> questions today.{' '}
                  <strong className="text-teal-400 font-bold">{remaining}</strong> more to reach your target!
                </span>
              )}
            </p>

            <button
              onClick={() => {
                sound.playClick();
                onResetTodayProgress();
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors pt-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset today&apos;s counter</span>
            </button>
          </div>
        </div>

        {/* Target Presets Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Your Daily Practice Target:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {presets.map((preset) => {
              const isSelected = selectedTarget === preset.count;
              return (
                <button
                  key={preset.count}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedTarget(preset.count);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-teal-950/70 border-teal-500 text-teal-100 ring-2 ring-teal-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {preset.isRecommended && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] font-bold uppercase">
                      Recommended
                    </span>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black text-white font-mono">
                      {preset.count}
                    </span>
                    <span className="text-xs font-bold text-slate-200">Questions</span>
                  </div>
                  <div className="text-[11px] text-teal-400 font-semibold">{preset.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{preset.time} · {preset.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Target Slider */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Custom Target:</span>
            <span className="font-mono text-teal-300 font-bold text-sm">
              {selectedTarget} Questions / Day
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={50}
            step={1}
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>3 Qs (Sprint)</span>
            <span>25 Qs (Half Mock)</span>
            <span>50 Qs (Full Mock)</span>
          </div>
        </div>

        {/* Motivational Tip */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start space-x-2.5">
          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Professor&apos;s Advice:</strong> Consistent daily exposure to
            Assertion-Reasoning and Statement-based questions trains the subconscious to spot distractor traps
            in Paper 2 within 45 seconds during the actual examination.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            {isSavedNotice ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Goal Saved!</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>Set Daily Goal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
