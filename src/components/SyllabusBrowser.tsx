import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  GraduationCap,
  Mountain,
  CloudRain,
  Waves,
  Leaf,
  Users,
  TrendingUp,
  Globe,
  Compass,
  MapPin,
  Microscope,
  BrainCircuit,
  SunMedium,
  School,
} from 'lucide-react';
import { SYLLABUS_UNITS } from '../data/syllabus';
import { SyllabusUnit } from '../types';
import { sound } from '../utils/audio';

interface SyllabusBrowserProps {
  onSelectTopicForGeneration: (topic: string, unitTitle: string, paper: 'Paper 1' | 'Paper 2 (Geography)') => void;
  onFilterPracticeByUnit: (unitTitle: string) => void;
}

export const SyllabusBrowser: React.FC<SyllabusBrowserProps> = ({
  onSelectTopicForGeneration,
  onFilterPracticeByUnit,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<'Paper 2 (Geography)' | 'Paper 1'>('Paper 2 (Geography)');

  const getUnitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain':
        return <Mountain className="w-5 h-5 text-amber-400" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-blue-400" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-rose-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-teal-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-yellow-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-orange-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-teal-400" />;
      case 'Microscope':
        return <Microscope className="w-5 h-5 text-emerald-400" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-indigo-400" />;
      case 'SunMedium':
        return <SunMedium className="w-5 h-5 text-amber-400" />;
      case 'School':
        return <School className="w-5 h-5 text-rose-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-400" />;
    }
  };

  const filteredUnits = SYLLABUS_UNITS.filter((u) => u.paper === selectedPaper);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official NTA NET & WBSET Syllabus Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Comprehensive Syllabus Navigator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Browse all units, high-yield focus themes, and generate custom practice items on any topic.
          </p>
        </div>

        {/* Paper Toggle */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedPaper('Paper 2 (Geography)');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedPaper === 'Paper 2 (Geography)'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paper 2: Geography (10 Units)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedPaper('Paper 1');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedPaper === 'Paper 1'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paper 1: Core Units
          </button>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/40 transition-all shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Unit Title Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    {getUnitIcon(unit.iconName)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-wider block">
                      Unit {unit.unitNumber}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {unit.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {unit.description}
              </p>

              {/* High-Yield Topics List */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  High-Yield Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {unit.highYieldTopics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        sound.playClick();
                        onSelectTopicForGeneration(topic, `Unit ${unit.unitNumber}: ${unit.title}`, unit.paper);
                      }}
                      title="Click to generate 3 NTA questions on this topic"
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-teal-950/70 text-slate-300 hover:text-teal-200 border border-slate-700/80 hover:border-teal-500/50 transition-all text-left group cursor-pointer"
                    >
                      <span>{topic}</span>
                      <span className="text-teal-400 opacity-0 group-hover:opacity-100 ml-1">&rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playClick();
                  onFilterPracticeByUnit(`Unit ${unit.unitNumber}: ${unit.title}`);
                }}
                className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                Browse Question Bank
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTopicForGeneration(
                    unit.highYieldTopics[0],
                    `Unit ${unit.unitNumber}: ${unit.title}`,
                    unit.paper
                  );
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 3 Qs for Unit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
