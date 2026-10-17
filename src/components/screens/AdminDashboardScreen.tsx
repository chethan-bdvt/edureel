import React from 'react';
import {
  BarChart3,
  Video,
  DollarSign,
  Users,
  PlusCircle,
  Eye,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { ReelVideo } from '../../types';

interface AdminDashboardScreenProps {
  reels: ReelVideo[];
  adImpressions: number;
  onOpenPostStudio: () => void;
  onSelectReel: (reel: ReelVideo) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  reels,
  adImpressions,
  onOpenPostStudio,
  onSelectReel,
}) => {
  // Aggregate subject distribution
  const subjectCounts = reels.reduce((acc, r) => {
    acc[r.subject] = (acc[r.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const estimatedRevenue = (adImpressions * 0.025).toFixed(2);

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Admin & Curriculum Portal</h2>
            <p className="text-[10px] text-slate-400">Platform Analytics & Content Ops</p>
          </div>
        </div>

        <button
          onClick={onOpenPostStudio}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Content</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase">Total Reels</span>
            <Video className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-lg font-bold text-white tabular-nums">{reels.length}</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>Active Curriculum</span>
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase">Ad Impressions</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white tabular-nums">{adImpressions}</p>
          <p className="text-[10px] text-amber-400">Est. Rev: ${estimatedRevenue}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase">Watch Views</span>
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-white tabular-nums">48,210</p>
          <p className="text-[10px] text-indigo-300">Strict ±1 Buffer</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-semibold uppercase">Active Learners</span>
            <Users className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <p className="text-lg font-bold text-white tabular-nums">1,420</p>
          <p className="text-[10px] text-pink-300">Pre-K to Gr 8</p>
        </div>
      </div>

      {/* Curriculum Subject Breakdown */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-2.5">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
          <span>Curriculum Subject Coverage</span>
        </h3>

        <div className="space-y-2">
          {Object.entries(subjectCounts).map(([subject, count]) => {
            const percentage = Math.round((count / reels.length) * 100);
            return (
              <div key={subject} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{subject}</span>
                  <span className="text-slate-400 tabular-nums">
                    {count} reels ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Published Content Management Table */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200">Published Reels Management</h3>
          <span className="text-[10px] text-sky-400">Showing all {reels.length}</span>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl divide-y divide-slate-750 overflow-hidden">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => onSelectReel(reel)}
              className="p-3 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                  <img src={reel.imageAsset} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{reel.title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {reel.subject} · {reel.grade}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {reel.author.isOfficialAdmin && (
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-400/30">
                    Admin
                  </span>
                )}
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {((reel.likes || 0) + (reel.isLiked ? 1 : 0)).toLocaleString()} likes
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
