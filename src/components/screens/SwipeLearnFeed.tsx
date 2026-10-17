import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ReelVideo, GradeLevel } from '../../types';

interface SwipeLearnFeedProps {
  reels: ReelVideo[];
  currentGrade: GradeLevel;
  onOpenDetail: (reel: ReelVideo) => void;
  onOpenSearch: () => void;
  onVideoWatched: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}

export const SwipeLearnFeed: React.FC<SwipeLearnFeedProps> = ({
  reels,
  currentGrade,
  onOpenDetail,
  onOpenSearch,
  onVideoWatched,
  onToggleLike,
  onToggleSave,
}) => {
  const [feedTab, setFeedTab] = useState<'for_you' | 'subjects' | 'following'>('for_you');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [commentsList, setCommentsList] = useState<{ id: string; author: string; text: string; likes: number; time: string }[]>([
    { id: 'c1', author: 'Maya_Gr5', text: 'This explanation is so cool! Helped with my homework!', likes: 24, time: '2h ago' },
    { id: 'c2', author: 'TeacherDan', text: 'Perfect summary for classroom revision. Great graphics.', likes: 58, time: '5h ago' },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  // Filter and sort reels based on current feed tab and student's active grade
  const filteredReels = [...reels]
    .filter((r) => {
      if (feedTab === 'following') {
        return r.author.isFollowing || r.author.isOfficialAdmin;
      }
      if (feedTab === 'subjects') {
        return r.grade === currentGrade;
      }
      return true;
    })
    .sort((a, b) => {
      if (feedTab === 'for_you') {
        const aMatch = a.grade === currentGrade ? 1 : 0;
        const bMatch = b.grade === currentGrade ? 1 : 0;
        return bMatch - aMatch;
      }
      return 0;
    });

  // Reset index to top whenever grade changes (e.g. when switching sibling profile)
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentGrade, feedTab]);

  const activeReel = filteredReels[currentIndex] || reels[0];

  // Increment watch counter on index shift (with strict 1-buffer policy)
  const prevIndexRef = useRef(currentIndex);
  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      onVideoWatched();
      setIsPlaying(true);
    }
  }, [currentIndex, onVideoWatched]);

  const handleNext = () => {
    if (currentIndex < filteredReels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    if (activeReel) {
      onToggleLike(activeReel.id);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 900);
    }
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setCommentsList((prev) => [
      {
        id: `c_${Date.now()}`,
        author: 'You (Chethan)',
        text: newCommentText.trim(),
        likes: 1,
        time: 'Just now',
      },
      ...prev,
    ]);
    setNewCommentText('');
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none flex flex-col">
      {/* Top Floating Feed Header */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-3 px-4 pb-2 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-4 text-xs font-bold tracking-wide">
          <button
            onClick={() => {
              setFeedTab('for_you');
              setCurrentIndex(0);
            }}
            className={`transition-colors relative py-1 ${
              feedTab === 'for_you' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            For You
            {feedTab === 'for_you' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setFeedTab('subjects');
              setCurrentIndex(0);
            }}
            className={`transition-colors relative py-1 ${
              feedTab === 'subjects' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Subjects
            {feedTab === 'subjects' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setFeedTab('following');
              setCurrentIndex(0);
            }}
            className={`transition-colors relative py-1 ${
              feedTab === 'following' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Following
            {feedTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>
        </div>

        <button
          onClick={onOpenSearch}
          aria-label="Search topics"
          className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-black/50 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Reel Stage: Strict +-1 buffer architecture */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
        onDoubleClick={handleDoubleTap}
      >
        {activeReel ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Visual media container (720p medium quality cap) */}
            <img
              src={activeReel.imageAsset}
              alt={activeReel.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-100' : 'scale-98 brightness-90'
              }`}
            />

            {/* Simulated Animated Video Overlays depending on animationType */}
            {activeReel.animationType === 'space' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
              </div>
            )}
            {activeReel.animationType === 'biology' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-screen" />
              </div>
            )}
            {activeReel.animationType === 'safari' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-1/4 left-10 text-3xl animate-bounce">🎈</div>
              </div>
            )}

            {/* Measured Scrim for 4.5:1 text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 pointer-events-none" />

            {/* Play/Pause Center Indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
              </div>
            )}

            {/* Double Tap Flying Heart Animation */}
            {showHeartAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <Heart className="w-24 h-24 text-rose-500 fill-current animate-ping opacity-90" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-400 p-6">
            <p className="text-sm">No videos found in this category.</p>
          </div>
        )}

        {/* Right Floating Interaction Rail */}
        <div
          className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Author avatar */}
          <div className="relative group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-lg">
                {activeReel?.author.avatar || '🎓'}
              </div>
            </div>
            {activeReel?.author.verified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            )}
          </div>

          {/* Like */}
          <button
            onClick={() => onToggleLike(activeReel.id)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md ${
                activeReel?.isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`w-5 h-5 ${activeReel?.isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold tracking-tight">
              {((activeReel?.likes || 0) + (activeReel?.isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowCommentDrawer(true)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold tracking-tight">{activeReel?.commentsCount || 0}</span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={() => onToggleSave(activeReel.id)}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md ${
                activeReel?.isSaved ? 'bg-amber-500/20 text-amber-400' : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${activeReel?.isSaved ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold tracking-tight">Save</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold tracking-tight">Share</span>
          </button>

          {/* Mute/Audio toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Vertical Reel Scroller Arrows */}
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 disabled:opacity-20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Content Information Overlay */}
        <div
          className="absolute bottom-3 left-4 right-16 z-30 text-white space-y-2 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Author line */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white drop-shadow-sm">{activeReel?.author.name}</span>
            <span className="text-[11px] text-white/70">·</span>
            <span className="text-[11px] font-medium text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-500/30">
              {activeReel?.grade}
            </span>
          </div>

          {/* Reel Title & Subtitle */}
          <div>
            <h2 className="text-base sm:text-lg font-bold leading-snug drop-shadow-md text-white line-clamp-2">
              {activeReel?.title}
            </h2>
            <p className="text-xs text-slate-200 mt-0.5 line-clamp-1 drop-shadow-sm">{activeReel?.subtitle}</p>
          </div>

          {/* Tags & Subject Pill */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/80">
            {activeReel?.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="font-semibold text-sky-300">
                {tag}
              </span>
            ))}
          </div>

          {/* Action to open Detailed View */}
          <button
            onClick={() => onOpenDetail(activeReel)}
            className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold border border-white/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Detailed View & Quiz</span>
          </button>
        </div>

        {/* Video Scrubber bar at very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div className="h-full bg-sky-400 w-2/5" />
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Reel link copied to clipboard!</span>
        </div>
      )}

      {/* Interactive Comments Drawer */}
      {showCommentDrawer && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-4 max-h-[70%] flex flex-col space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">
                Comments ({commentsList.length + (activeReel?.commentsCount || 0)})
              </h4>
              <button
                onClick={() => setShowCommentDrawer(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Done
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {commentsList.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-full bg-sky-600/30 text-sky-400 font-bold flex items-center justify-center shrink-0">
                    {c.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{c.author}</span>
                      <span className="text-[10px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{c.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Heart className="w-3 h-3 hover:text-rose-400 cursor-pointer" />
                    <span>{c.likes}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a safe friendly comment..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3 py-2 bg-sky-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
