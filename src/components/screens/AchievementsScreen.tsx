import React, { useState } from 'react';
import { ArrowLeft, Award, Target, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Badge, LearningGoal } from '../../types';

interface AchievementsScreenProps {
  badges: Badge[];
  goals: LearningGoal[];
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  badges,
  goals,
  onBack,
}) => {
  const [tab, setTab] = useState<'badges' | 'goals'>('badges');

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="text-sm font-bold text-white">Achievements & Goals</h2>

        <div className="w-8 h-8" />
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl">
        <button
          onClick={() => setTab('badges')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            tab === 'badges' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Badges</span>
        </button>

        <button
          onClick={() => setTab('goals')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            tab === 'goals' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Goals</span>
        </button>
      </div>

      {/* Badges Grid Tab */}
      {tab === 'badges' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Unlocked: <strong className="text-white">{badges.filter((b) => b.unlocked).length}</strong> /{' '}
              {badges.length}
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Level 4 Explorer</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  badge.unlocked
                    ? 'bg-slate-800/90 border-slate-750 shadow-md ring-1 ring-sky-500/20'
                    : 'bg-slate-850/50 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-amber-500/20 to-sky-500/20 border border-amber-400/30'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  {badge.unlocked && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <div className="mt-2.5 space-y-1">
                  <h4 className="text-xs font-bold text-white leading-tight">{badge.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{badge.description}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span>Progress</span>
                    <span className="tabular-nums font-mono">
                      {badge.progress} / {badge.max}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        badge.unlocked ? 'bg-amber-400' : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.min(100, (badge.progress / badge.max) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {tab === 'goals' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Complete daily learning challenges to unlock bonus explorer points:
          </p>

          <div className="space-y-2.5">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-slate-800/80 border border-slate-750 rounded-2xl p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {goal.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Target className="w-4 h-4 text-sky-400" />
                    )}
                    <span>{goal.title}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      goal.completed
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-sky-500/20 text-sky-300'
                    }`}
                  >
                    {goal.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Target</span>
                    <span className="tabular-nums font-mono">
                      {goal.currentCount} / {goal.targetCount} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, (goal.currentCount / goal.targetCount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
