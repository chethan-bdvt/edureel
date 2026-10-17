import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, FastForward, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { AdData } from '../types';

interface MonetizationAdModalProps {
  ad: AdData;
  reason: 'watch_streak' | 'video_generation';
  onClose: () => void;
  isBackgroundGenerating?: boolean;
}

export const MonetizationAdModal: React.FC<MonetizationAdModalProps> = ({
  ad,
  reason,
  onClose,
  isBackgroundGenerating = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(ad.durationSeconds || 5);
  const [canSkip, setCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setCanSkip(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((ad.durationSeconds - secondsRemaining) / ad.durationSeconds) * 100))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
      {/* Top Header bar inside ad */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
            Ad
          </span>
          <span className="text-xs font-medium text-slate-300">
            {reason === 'watch_streak' ? '5 Videos Watched Milestone' : 'Creator Sponsor'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              canSkip
                ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-md scale-100'
                : 'bg-white/20 text-white/80 cursor-pointer hover:bg-white/30'
            }`}
          >
            <span>{canSkip ? 'Skip Ad' : `Skip in ${secondsRemaining}s`}</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Creative Center */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 max-w-lg mx-auto w-full">
        {/* Ad Video / Display Canvas */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group">
          <img
            src={ad.imageAsset}
            alt={ad.headline}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback styling if local image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />

          {/* Fallback gradient banner */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <span className="text-xs font-semibold text-amber-400">{ad.sponsorName}</span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{ad.headline}</h3>
          </div>

          {/* Progress bar along bottom of video */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Informational Subtext & Background Generation Notice */}
        <div className="mt-4 text-center px-4 w-full">
          <p className="text-xs text-slate-300 line-clamp-2">{ad.tagline}</p>

          {isBackgroundGenerating && (
            <div className="mt-3 p-3 bg-sky-950/80 border border-sky-500/30 rounded-xl flex items-center justify-center gap-2 text-xs text-sky-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>
                <strong>Your video is generating in the background!</strong> Skip when ready to explore.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="w-full max-w-lg mx-auto flex flex-col gap-2 z-10 pb-2">
        <button
          onClick={() => setShowLearnMore(true)}
          className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-98 transition-transform"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-center text-slate-500">
          Family Safe Ads • Supports Free High-Quality STEM Education
        </p>
      </div>

      {/* Learn More Sponsor Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-bold text-white text-sm">Sponsored Partner: {ad.sponsorName}</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              STEM Explorer kits bring hands-on robotics, electronic circuits, and spatial logic into the home. Verified safe for ages 4+.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowLearnMore(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
