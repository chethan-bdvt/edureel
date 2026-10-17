import React from 'react';
import { Home, Compass, Plus, Users, User } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, onNavigate }) => {
  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around z-40 select-none shrink-0">
      {/* Home (Feed) */}
      <button
        onClick={() => onNavigate('feed')}
        className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition-colors ${
          activeScreen === 'feed' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      {/* Discover (Explore) */}
      <button
        onClick={() => onNavigate('explore')}
        className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition-colors ${
          activeScreen === 'explore' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Discover</span>
      </button>

      {/* (+) Create / Request Custom Video */}
      <button
        onClick={() => onNavigate('request-video')}
        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Create or request custom video"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Community */}
      <button
        onClick={() => onNavigate('community')}
        className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition-colors ${
          activeScreen === 'community' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Community</span>
      </button>

      {/* Profile / Progress */}
      <button
        onClick={() => onNavigate('progress')}
        className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition-colors ${
          activeScreen === 'progress' || activeScreen === 'settings' || activeScreen === 'achievements'
            ? 'text-sky-400'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
