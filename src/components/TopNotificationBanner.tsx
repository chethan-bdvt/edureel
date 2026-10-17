import React from 'react';
import { Sparkles, Play, X } from 'lucide-react';
import { ReelVideo } from '../types';

interface TopNotificationBannerProps {
  video: ReelVideo | null;
  onWatchNow: (video: ReelVideo) => void;
  onDismiss: () => void;
}

export const TopNotificationBanner: React.FC<TopNotificationBannerProps> = ({
  video,
  onWatchNow,
  onDismiss,
}) => {
  if (!video) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl shadow-xl shadow-sky-900/30 border border-sky-400/30 p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Reel Ready!</p>
            <p className="text-sm font-semibold truncate text-white">{video.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onWatchNow(video)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-sky-700 text-xs font-bold rounded-xl shadow-sm hover:bg-sky-50 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch</span>
          </button>
          <button
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
