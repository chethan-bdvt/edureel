import React, { useState } from 'react';
import {
  ArrowLeft,
  Mic,
  Sparkles,
  Calculator,
  FlaskConical,
  BookMarked,
  Globe2,
  Cpu,
  Languages,
  Baby,
  MoreHorizontal,
} from 'lucide-react';
import { GradeLevel, SubjectCategory } from '../../types';

interface RequestCustomVideoScreenProps {
  initialPrompt?: string;
  initialSubject?: SubjectCategory;
  currentGrade: GradeLevel;
  onBack: () => void;
  onSubmitRequest: (topic: string, subject: SubjectCategory, grade: GradeLevel) => void;
}

const SUBJECT_OPTIONS: { name: SubjectCategory; icon: any; color: string; bg: string }[] = [
  { name: 'Mathematics', icon: Calculator, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { name: 'Science', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { name: 'English', icon: BookMarked, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { name: 'Social Studies', icon: Globe2, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { name: 'Computer Science', icon: Cpu, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  { name: 'Languages', icon: Languages, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { name: 'Nursery & Pre-K', icon: Baby, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { name: 'Other / Custom', icon: MoreHorizontal, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
];

const GRADE_OPTIONS: GradeLevel[] = [
  'Nursery & Pre-K',
  'Grade 1-2',
  'Grade 3-5',
  'Grade 6-8',
];

export const RequestCustomVideoScreen: React.FC<RequestCustomVideoScreenProps> = ({
  initialPrompt = '',
  initialSubject = 'Science',
  currentGrade,
  onBack,
  onSubmitRequest,
}) => {
  const [topic, setTopic] = useState(initialPrompt);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory>(initialSubject);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentGrade);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmitRequest(topic.trim(), selectedSubject, selectedGrade);
  };

  const handleQuickSuggestion = (suggestedTopic: string, subject: SubjectCategory) => {
    setTopic(suggestedTopic);
    setSelectedSubject(subject);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="text-sm font-bold text-white text-center">Request Custom Video</h1>

        <div className="w-8 h-8" />
      </div>

      <div className="p-4 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Prompt Input Form */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">What would you like to learn about?</label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Explain photosynthesis with real life examples"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 pr-10 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setTopic('Why do volcanoes erupt with lava and smoke?')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400"
                title="Tap for voice or suggestion"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Enter any question or concept. LearnLoop AI compiles a 60-second animated reel!
            </p>
          </div>

          {/* Quick Idea Presets */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickSuggestion('Explain fractions with pizza slices', 'Mathematics')}
              className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700"
            >
              🍕 Fractions with pizza
            </button>
            <button
              type="button"
              onClick={() => handleQuickSuggestion('Why do leaves change color in autumn?', 'Science')}
              className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700"
            >
              🍂 Autumn leaves
            </button>
            <button
              type="button"
              onClick={() => handleQuickSuggestion('Learn ABCs with safari zoo animals', 'Nursery & Pre-K')}
              className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-pink-300 rounded-lg border border-pink-500/20"
            >
              🦁 Pre-K Safari ABC
            </button>
          </div>

          {/* Target Grade Selector */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-200">Target Grade Level</label>
            <div className="grid grid-cols-2 gap-2">
              {GRADE_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    selectedGrade === g
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Choose a Subject Grid */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-200">Or choose a subject</label>
            <div className="grid grid-cols-2 gap-2.5">
              {SUBJECT_OPTIONS.map((subj) => {
                const Icon = subj.icon;
                const isSelected = selectedSubject === subj.name;
                return (
                  <button
                    key={subj.name}
                    type="button"
                    onClick={() => setSelectedSubject(subj.name)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all active:scale-95 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/10 shadow-md ring-1 ring-sky-400/50'
                        : `${subj.bg} border-slate-800 hover:border-slate-700`
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-slate-900 ${subj.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white leading-tight">{subj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-2">
          <button
            onClick={handleSubmit}
            disabled={!topic.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Create Video</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            A short sponsor ad will play first. Generation runs in the background so you can keep browsing!
          </p>
        </div>
      </div>
    </div>
  );
};
