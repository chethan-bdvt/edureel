import React from 'react';
import {
  Smartphone,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Users,
  LogIn,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { ScreenId, GradeLevel, AuthUser, StudentProfile } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  currentGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  isBackgroundGenerating: boolean;
  currentUser: AuthUser | null;
  activeStudent: StudentProfile | null;
  onOpenSiblingModal: () => void;
  onOpenAuthModal: () => void;
}

const SCREEN_TABS: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'feed', label: '1. Feed', icon: '📱' },
  { id: 'detail', label: '2. Detailed', icon: '🔬' },
  { id: 'ai-assistant', label: '3. Owl Master', icon: '🦉' },
  { id: 'request-video', label: '4. Create Reel', icon: '✨' },
  { id: 'explore', label: '5. Explore', icon: '🔍' },
  { id: 'community', label: '6. Community', icon: '👥' },
  { id: 'admin-dashboard', label: '7. Admin Stats', icon: '📊' },
  { id: 'admin-post', label: '8. Post Studio', icon: '📝' },
  { id: 'progress', label: '9. Progress', icon: '📈' },
  { id: 'achievements', label: '10. Badges', icon: '🏆' },
  { id: 'settings', label: '11. Settings', icon: '⚙️' },
];

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeScreen,
  onNavigate,
  isPhoneFrame,
  onTogglePhoneFrame,
  currentGrade,
  onGradeChange,
  isBackgroundGenerating,
  currentUser,
  activeStudent,
  onOpenSiblingModal,
  onOpenAuthModal,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4">
      {/* Top Global Command Dock */}
      <header className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-lg backdrop-blur-md">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400 font-black text-sm">
              ▶
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">LearnLoop</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded font-bold border border-sky-500/30">
                Kids & Teachers
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Short Videos. Big Ideas. Brighter Futures.
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Background Job Indicator */}
          {isBackgroundGenerating && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950 border border-sky-500/40 text-sky-300 text-[11px] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Compiling Video in Background...</span>
            </div>
          )}

          {/* Sibling Switcher or Teacher Badge */}
          {currentUser?.role === 'teacher' ? (
            <div
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/40 px-2.5 py-1 rounded-xl cursor-pointer hover:bg-indigo-900 transition-colors"
            >
              <span className="text-sm">👩🏻‍🏫</span>
              <div className="text-left">
                <span className="text-[11px] font-bold text-white block leading-none">
                  {currentUser.teacherProfile?.name || 'Teacher'}
                </span>
                <span className="text-[9px] text-indigo-300">
                  {currentUser.teacherProfile?.subjects.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenSiblingModal}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-pink-500/30 px-2.5 py-1 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors"
              title="Click to switch sibling profile"
            >
              <span className="text-sm">{activeStudent?.avatar || '👦🏽'}</span>
              <span>
                {activeStudent?.name || 'Student'} ({activeStudent?.grade || currentGrade})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Account Switcher Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl border border-slate-700 transition-colors text-[11px]"
            title="Create account or switch Student/Teacher role"
          >
            <LogIn className="w-3 h-3 text-sky-400" />
            <span>Account</span>
          </button>

          {/* Grade Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
            <span className="text-[10px] text-slate-400 font-medium">Curriculum:</span>
            <select
              value={currentGrade}
              onChange={(e) => onGradeChange(e.target.value as GradeLevel)}
              className="bg-transparent text-sky-300 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="Nursery & Pre-K" className="bg-slate-900 text-white">
                Nursery & Pre-K
              </option>
              <option value="Grade 1-2" className="bg-slate-900 text-white">
                Grade 1-2
              </option>
              <option value="Grade 3-5" className="bg-slate-900 text-white">
                Grade 3-5
              </option>
              <option value="Grade 6-8" className="bg-slate-900 text-white">
                Grade 6-8
              </option>
            </select>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={onTogglePhoneFrame}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Toggle between phone frame and responsive layout"
          >
            {isPhoneFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isPhoneFrame ? 'Full Bleed' : 'Phone Frame'}</span>
          </button>
        </div>
      </header>

      {/* Screen Switcher Tray (Quick jump to any screen) */}
      <div className="w-full max-w-5xl mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1">
          Quick Screens:
        </span>
        {SCREEN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeScreen === tab.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Device Viewport */}
      <main
        className={`w-full transition-all duration-300 flex items-center justify-center ${
          isPhoneFrame ? 'max-w-[390px] my-auto' : 'max-w-md sm:max-w-xl md:max-w-2xl'
        }`}
      >
        <div
          className={`w-full relative bg-slate-900 text-slate-100 flex flex-col overflow-hidden transition-all ${
            isPhoneFrame
              ? 'h-[820px] rounded-[48px] border-[10px] border-slate-800 shadow-2xl ring-1 ring-white/10'
              : 'h-[85vh] rounded-3xl border border-slate-800 shadow-xl'
          }`}
        >
          {/* Phone Top Status Bar (9:41, Dynamic Island) */}
          <div className="relative pt-2 px-6 pb-1 flex items-center justify-between text-xs font-bold text-white z-40 bg-slate-950/70 backdrop-blur-md select-none shrink-0">
            <span className="font-semibold text-xs tracking-tight">9:41</span>

            {/* Dynamic Island Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 shadow-inner border border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Active Screen Viewport */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col bg-slate-950">
            {children}
          </div>

          {/* Bottom Home Indicator Bar for Phone Frame */}
          {isPhoneFrame && (
            <div className="w-full bg-slate-950 py-1.5 flex items-center justify-center shrink-0 z-40">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
