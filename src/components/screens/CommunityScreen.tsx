import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Play,
  ShieldCheck,
  UserPlus,
  UserCheck,
  Lock,
  Globe,
  PlusCircle,
  Users,
  Video,
  BookOpen,
} from 'lucide-react';
import { ReelVideo, CommunityChannel, AuthUser } from '../../types';

interface CommunityScreenProps {
  reels: ReelVideo[];
  channels: CommunityChannel[];
  currentUser: AuthUser | null;
  onSelectReel: (reel: ReelVideo) => void;
  onSelectChannel: (channel: CommunityChannel) => void;
  onOpenCreateChannel: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  reels,
  channels,
  currentUser,
  onSelectReel,
  onSelectChannel,
  onOpenCreateChannel,
  onToggleLike,
  onToggleSave,
}) => {
  const [tab, setTab] = useState<'channels' | 'trending' | 'latest' | 'my_feed'>('channels');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    '@science_riya': true,
    '@arjun_math': false,
    '@prek_safari': true,
  });

  const toggleFollow = (handle: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
  };

  const communityPosts = reels.filter((r) => {
    if (tab === 'latest') return true;
    if (tab === 'my_feed') return followingMap[r.author.handle] || r.author.isOfficialAdmin;
    return true; // trending
  });

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-4">
      {/* Header & Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Community & Channels</h2>
            <p className="text-[10px] text-slate-400">Classrooms, Student Creators & Educators</p>
          </div>

          {/* Teacher "+ Create Channel" button */}
          {currentUser?.role === 'teacher' && (
            <button
              onClick={onOpenCreateChannel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Channel</span>
            </button>
          )}
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl overflow-x-auto no-scrollbar">
          {(['channels', 'trending', 'latest', 'my_feed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 min-w-[75px] py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-all ${
                tab === t ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'channels' ? 'Channels' : t === 'my_feed' ? 'My Feed' : t}
            </button>
          ))}
        </div>
      </div>

      {/* CHANNELS TAB */}
      {tab === 'channels' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Teacher Community Channels ({channels.length})</span>
            {currentUser?.role !== 'teacher' && (
              <span className="text-[10px] text-sky-400 font-medium">Click to enter passcode or join</span>
            )}
          </div>

          <div className="space-y-3">
            {channels.map((chan) => {
              const isJoined = currentUser?.joinedChannelIds.includes(chan.id);
              return (
                <div
                  key={chan.id}
                  onClick={() => onSelectChannel(chan)}
                  className="bg-slate-800/80 border border-slate-750 rounded-2xl overflow-hidden cursor-pointer hover:border-sky-500/50 shadow-md group transition-all"
                >
                  {/* Channel Top Header Strip */}
                  <div className={`h-14 bg-gradient-to-r ${chan.coverColor} p-2.5 flex items-start justify-between relative`}>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        chan.isPrivate
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {chan.isPrivate ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                      <span>{chan.isPrivate ? 'Private Class' : 'Public'}</span>
                    </span>

                    {isJoined && (
                      <span className="text-[9px] bg-black/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                        Joined
                      </span>
                    )}
                  </div>

                  {/* Channel Body */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0 -mt-6 shadow-lg">
                        {chan.teacherAvatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                          {chan.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">By {chan.teacherName}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {chan.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between border-t border-slate-750 text-[10px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-sky-400" />
                          <span>{chan.enrolledStudents.length} Students</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3 text-emerald-400" />
                          <span>{chan.videoIds.length} Reels</span>
                        </span>
                      </div>

                      <div className="flex gap-1">
                        {chan.subjects.slice(0, 2).map((s) => (
                          <span key={s} className="bg-slate-700/80 px-1.5 py-0.2 rounded text-[9px] text-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REELS FEEDS (Trending / Latest / My Feed) */}
      {tab !== 'channels' && (
        <div className="space-y-4">
          {communityPosts.map((reel) => {
            const isFollowing = followingMap[reel.author.handle];
            return (
              <div
                key={reel.id}
                className="bg-slate-800/70 border border-slate-750 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Post Author Bar */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                      {reel.author.avatar || '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{reel.author.name}</span>
                        {reel.author.isOfficialAdmin && (
                          <span className="bg-sky-500/20 text-sky-400 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-sky-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Admin</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{reel.author.gradeBadge || reel.grade}</p>
                    </div>
                  </div>

                  {!reel.author.isOfficialAdmin && (
                    <button
                      onClick={() => toggleFollow(reel.author.handle)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all ${
                        isFollowing
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-650'
                          : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sm'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Video Thumbnail Stage */}
                <div
                  onClick={() => onSelectReel(reel)}
                  className="relative aspect-video bg-black overflow-hidden cursor-pointer group"
                >
                  <img
                    src={reel.imageAsset}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 px-2 py-0.5 rounded text-white font-mono">
                    {reel.duration}
                  </span>
                </div>

                {/* Post Description & Action Bar */}
                <div className="p-3 space-y-2">
                  <h3
                    onClick={() => onSelectReel(reel)}
                    className="text-xs font-bold text-white hover:text-sky-300 cursor-pointer"
                  >
                    {reel.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{reel.summary}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-750 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onToggleLike(reel.id)}
                        className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${reel.isLiked ? 'text-rose-500 fill-current' : ''}`} />
                        <span>{((reel.likes || 0) + (reel.isLiked ? 1 : 0)).toLocaleString()}</span>
                      </button>
                      <button
                        onClick={() => onSelectReel(reel)}
                        className="flex items-center gap-1 hover:text-sky-400 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{reel.commentsCount}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onToggleSave(reel.id)}
                      className="hover:text-amber-400 transition-colors"
                    >
                      <Bookmark className={`w-4 h-4 ${reel.isSaved ? 'text-amber-400 fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
