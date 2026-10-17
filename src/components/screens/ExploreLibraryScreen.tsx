import React, { useState } from 'react';
import { Search, ChevronRight, Play, X, BookOpen } from 'lucide-react';
import { ReelVideo, SubjectCategory } from '../../types';
import { POPULAR_TOPICS, SUBJECTS_LIST } from '../../data/mockCurriculum';

interface ExploreLibraryScreenProps {
  reels: ReelVideo[];
  onSelectReel: (reel: ReelVideo) => void;
}

export const ExploreLibraryScreen: React.FC<ExploreLibraryScreenProps> = ({ reels, onSelectReel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Pre-K' | 'Math' | 'Science' | 'English' | 'Social'>('All');

  // Filter reels based on search or chip
  const filteredReels = reels.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'Pre-K') return r.grade === 'Nursery & Pre-K';
    if (selectedFilter === 'Math') return r.subject === 'Mathematics';
    if (selectedFilter === 'Science') return r.subject === 'Science';
    if (selectedFilter === 'English') return r.subject === 'English';
    if (selectedFilter === 'Social') return r.subject === 'Social Studies';
    return true;
  });

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-5">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, planets, algebra, cells..."
          className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['All', 'Pre-K', 'Math', 'Science', 'English', 'Social'] as const).map((chip) => (
          <button
            key={chip}
            onClick={() => setSelectedFilter(chip)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === chip
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Active Search / Filter Results */}
      {searchQuery || selectedFilter !== 'All' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Results ({filteredReels.length})
            </h3>
            {(searchQuery || selectedFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('All');
                }}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel)}
                className="bg-slate-800/80 border border-slate-700/70 rounded-2xl overflow-hidden cursor-pointer group hover:border-sky-500/50 transition-all"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={reel.imageAsset}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-current opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] bg-black/70 px-1.5 py-0.5 rounded text-white font-mono">
                    {reel.duration}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] text-sky-400 font-semibold">{reel.subject}</p>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{reel.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{reel.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Popular Topics Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200">Popular Topics</h3>
              <span className="text-[11px] text-sky-400 font-semibold cursor-pointer">See all</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {POPULAR_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => setSearchQuery(topic.title)}
                  className={`p-3 rounded-2xl border ${topic.bg} cursor-pointer hover:brightness-110 active:scale-95 transition-all`}
                >
                  <span className="text-2xl">{topic.icon}</span>
                  <h4 className="text-xs font-bold text-white mt-2">{topic.title}</h4>
                  <p className="text-[10px] text-slate-400">{topic.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Directory */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-bold text-slate-200">Subjects</h3>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl divide-y divide-slate-700/60 overflow-hidden">
              {SUBJECTS_LIST.map((subj) => (
                <div
                  key={subj.name}
                  onClick={() => setSearchQuery(subj.name)}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{subj.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{subj.name}</h4>
                      <p className="text-[10px] text-slate-400">{subj.count}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
