import React from 'react';
import { Play, Moon } from 'lucide-react';

interface InactivityModalProps {
  onResume: () => void;
}

export const InactivityModal: React.FC<InactivityModalProps> = ({ onResume }) => {
  return (
    <div
      onClick={onResume}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer animate-in fade-in duration-300"
    >
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <Moon className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white">Are you still watching?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We paused playback after 1 minute of inactivity to save battery and reduce streaming data.
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onResume();
          }}
          className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95 transition-transform"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Continue Learning</span>
        </button>
      </div>
    </div>
  );
};
