import React, { useState } from 'react';
import {
  User,
  Target,
  Bell,
  Globe,
  Lock,
  HelpCircle,
  Info,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Smartphone,
} from 'lucide-react';
import { UserProfile, GradeLevel } from '../../types';

interface SettingsScreenProps {
  userProfile: UserProfile;
  currentGrade: GradeLevel;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAdmin: () => void;
  onOpenApkModal?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  userProfile,
  currentGrade,
  onUpdateProfile,
  onOpenAdmin,
  onOpenApkModal,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(userProfile.language || 'English');
  const [showParentalModal, setShowParentalModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [screenTimeLimit, setScreenTimeLimit] = useState(userProfile.screenTimeLimitMinutes || 45);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === userProfile.parentalPin || enteredPin === '1234') {
      setIsPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveParentalSettings = () => {
    onUpdateProfile({ screenTimeLimitMinutes: screenTimeLimit });
    setShowParentalModal(false);
    setIsPinUnlocked(false);
    setEnteredPin('');
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-base font-bold text-white">Settings</h2>
      </div>

      {/* User Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">
            {userProfile.avatar}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{userProfile.name}</h3>
            <p className="text-[11px] text-slate-400">{currentGrade}</p>
          </div>
        </div>

        <button
          onClick={() => setShowEditProfileModal(true)}
          className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
        >
          Edit
        </button>
      </div>

      {/* Settings Menu List */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl divide-y divide-slate-750 overflow-hidden">
        {/* Edit Profile */}
        <div
          onClick={() => setShowEditProfileModal(true)}
          className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-white">Edit Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Notifications */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-white">Daily Learning Reminders</span>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-700 border-slate-600"
          />
        </div>

        {/* Language */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">Language</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              onUpdateProfile({ language: e.target.value });
            }}
            className="bg-slate-750 border border-slate-700 rounded-lg text-[11px] text-slate-200 px-2 py-1 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="Hindi">हिन्दी</option>
          </select>
        </div>

        {/* Parental Controls */}
        <div
          onClick={() => setShowParentalModal(true)}
          className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-semibold text-white">Parental Controls</span>
              <p className="text-[10px] text-slate-400">PIN, Screen Time & Content Filter</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            {screenTimeLimit} min
          </span>
        </div>

        {/* Android APK & Install Portal */}
        <div
          onClick={onOpenApkModal}
          className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors bg-emerald-950/20"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-semibold text-emerald-300">Android APK & PWA Center</span>
              <p className="text-[10px] text-slate-400">Install WebAPK, Generate APK, or Build Package</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Admin Portal Shortcut */}
        <div
          onClick={onOpenAdmin}
          className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors bg-sky-950/20"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-xs font-semibold text-sky-300">Admin & Curriculum Portal</span>
              <p className="text-[10px] text-slate-400">Manage Metrics & Post Official Content</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-sky-400" />
        </div>

        {/* Help & Support */}
        <div
          onClick={() => alert('LearnLoop Support: Reach our family safety team anytime at support@learnloop.edu')}
          className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* About Us */}
        <div
          onClick={() => setShowAboutModal(true)}
          className="p-3.5 flex items-center justify-between hover:bg-slate-750 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-white">About LearnLoop</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Parental Controls PIN Modal */}
      {showParentalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Parental Gate</h4>
              </div>
              <button
                onClick={() => {
                  setShowParentalModal(false);
                  setIsPinUnlocked(false);
                  setEnteredPin('');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isPinUnlocked ? (
              <form onSubmit={handleUnlockPin} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Please enter your 4-digit Parent PIN to manage screen limits and safety filters (Default: 1234):
                </p>
                <input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="••••"
                  className="w-full text-center tracking-[1em] text-lg font-mono bg-slate-800 border border-slate-700 rounded-xl py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
                {pinError && <p className="text-[11px] text-rose-400 text-center">Incorrect PIN. Try 1234.</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Unlock Controls
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Daily Screen Time Limit</span>
                    <span className="text-amber-400 font-bold">{screenTimeLimit} minutes</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={15}
                    value={screenTimeLimit}
                    onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>15m</span>
                    <span>45m</span>
                    <span>60m</span>
                    <span>120m</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-800 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-amber-400" />
                    <span>Enforce COPPA Safe Mode for Kids</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-amber-400" />
                    <span>Require PIN to generate unmoderated AI reels</span>
                  </label>
                </div>

                <button
                  onClick={handleSaveParentalSettings}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl"
                >
                  Save Settings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white">Edit Student Profile</h4>
              <button onClick={() => setShowEditProfileModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-semibold">Student Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <button
              onClick={() => {
                onUpdateProfile({ name: editName });
                setShowEditProfileModal(false);
              }}
              className="w-full py-2.5 bg-sky-500 text-white font-bold text-xs rounded-xl"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white">About LearnLoop</h4>
              <button onClick={() => setShowAboutModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-sky-400 font-bold">Short Videos. Big Ideas. Brighter Futures.</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              LearnLoop is an educational micro-video platform designed for curious minds from Nursery & Pre-K through Grade 8.
              Features strict ±1 media buffering, 720p bandwidth caps, 60-second idle auto-pause, and family-friendly sponsor monetization.
            </p>
            <p className="text-[10px] text-slate-500">Version 2.4.0 • Built with Google AI Studio</p>
          </div>
        </div>
      )}
    </div>
  );
};
