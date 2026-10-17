import React, { useState } from 'react';
import { UserProfile, GradeLevel } from '../../types';
import {
  TrendingUp,
  Award,
  Video,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface ProgressScreenProps {
  userProfile: UserProfile;
  currentGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  onOpenAchievements: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  userProfile,
  currentGrade,
  onGradeChange,
  onOpenAchievements,
}) => {
  const [tab, setTab] = useState<'overview' | 'subjects' | 'achievements'>('overview');

  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (userProfile.overallProgress / 100) * circumference;

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-4">
      {/* Header Profile Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-2xl shadow-md shadow-sky-500/20">
            {userProfile.avatar}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{userProfile.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-sky-400 font-semibold">{currentGrade}</span>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-current" />
                <span>5 Day Streak</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Grade Switcher */}
        <select
          value={currentGrade}
          onChange={(e) => onGradeChange(e.target.value as GradeLevel)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
        >
          <option value="Nursery & Pre-K">Pre-K</option>
          <option value="Grade 1-2">Grades 1-2</option>
          <option value="Grade 3-5">Grades 3-5</option>
          <option value="Grade 6-8">Grades 6-8</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl">
        {(['overview', 'subjects', 'achievements'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              if (t === 'achievements') {
                onOpenAchievements();
              } else {
                setTab(t);
              }
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              tab === t ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Circular Progress Gauge */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  className="text-slate-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={circleRadius}
                  className="text-sky-400 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white tabular-nums">
                  {userProfile.overallProgress}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Progress</span>
              </div>
            </div>

            <div className="text-center mt-3">
              <h3 className="text-sm font-bold text-white">Overall Progress</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">You're doing great!</p>
            </div>
          </div>

          {/* Metric Counter Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-3">
              <p className="text-lg font-black text-sky-400 tabular-nums">{userProfile.videosWatched}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Videos Watched</p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-3">
              <p className="text-lg font-black text-emerald-400 tabular-nums">{userProfile.quizzesCompleted}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Quizzes Done</p>
            </div>
            <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-3">
              <p className="text-lg font-black text-amber-400 tabular-nums">{userProfile.badgesEarned}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Badges Won</p>
            </div>
          </div>

          {/* Subject Progress Section */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200">Subject Mastery</h3>
              <span className="text-[10px] text-slate-400">Weekly Goal: 80%</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(userProfile.subjectProgress).map(([subj, pct]) => (
                <div key={subj} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{subj}</span>
                    <span className="text-sky-400 font-bold tabular-nums">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subjects Tab Content */}
      {tab === 'subjects' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Click any subject to view completed lessons and upcoming micro-modules:
          </p>

          <div className="space-y-2">
            {Object.entries(userProfile.subjectProgress).map(([subj, pct]) => (
              <div
                key={subj}
                className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{subj}</h4>
                  <p className="text-[10px] text-slate-400">Current Mastery: {pct}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-sky-400">{pct}%</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
