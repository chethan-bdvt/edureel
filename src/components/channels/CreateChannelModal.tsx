import React, { useState } from 'react';
import { X, Lock, Globe, Sparkles, Plus, BookOpen } from 'lucide-react';
import { CommunityChannel, SubjectCategory, TeacherProfile } from '../../types';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherProfile: TeacherProfile;
  onCreateChannel: (channel: CommunityChannel) => void;
}

const COVER_GRADIENTS = [
  'from-sky-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-purple-600 to-pink-600',
  'from-amber-600 to-orange-600',
  'from-rose-600 to-red-600',
];

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  teacherProfile,
  onCreateChannel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectCategory[]>(
    teacherProfile.subjects.length > 0 ? [teacherProfile.subjects[0]] : ['Science']
  );
  const [selectedGradient, setSelectedGradient] = useState(COVER_GRADIENTS[0]);

  if (!isOpen) return null;

  const toggleSubject = (subj: SubjectCategory) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chanId = `chan_${Date.now()}`;
    const newChannel: CommunityChannel = {
      id: chanId,
      name: name.trim(),
      description: description.trim() || `Community learning channel led by ${teacherProfile.name}`,
      isPrivate,
      passcode: isPrivate ? passcode.trim() || 'LEARN101' : undefined,
      inviteLink: `https://learnloop.app/join/${chanId}`,
      teacherId: teacherProfile.id,
      teacherName: teacherProfile.name,
      teacherAvatar: teacherProfile.avatar || '👩🏻‍🏫',
      subjects: selectedSubjects,
      enrolledStudents: [],
      pendingRequests: [],
      videoIds: [],
      coverColor: selectedGradient,
      createdAt: 'Just now',
    };

    onCreateChannel(newChannel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Create Community Channel</h3>
              <p className="text-[10px] text-slate-400">Led by {teacherProfile.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Channel Name */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Channel Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 6th Grade Science Explorers"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Weekly micro-lessons, homework hints, and live discussion..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Privacy Type (Public vs Private) */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Channel Privacy</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  !isPrivate
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 ring-1 ring-sky-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-[11px] text-white">Public Channel</h5>
                  <p className="text-[9px] text-slate-400">Open to all students</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  isPrivate
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-[11px] text-white">Private Class</h5>
                  <p className="text-[9px] text-slate-400">Passcode required</p>
                </div>
              </button>
            </div>
          </div>

          {/* Passcode if private */}
          {isPrivate && (
            <div className="space-y-1 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl">
              <label className="text-amber-300 font-semibold text-[11px]">Classroom Passcode / PIN</label>
              <input
                type="text"
                required={isPrivate}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. BIO101 or 7744"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Subject Categories */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Subject Focus</label>
            <div className="flex flex-wrap gap-1.5">
              {teacherProfile.subjects.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleSubject(subj)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Gradient Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Cover Theme</label>
            <div className="flex items-center gap-2">
              {COVER_GRADIENTS.map((grad) => (
                <button
                  key={grad}
                  type="button"
                  onClick={() => setSelectedGradient(grad)}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr ${grad} transition-transform ${
                    selectedGradient === grad ? 'scale-115 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-98 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch Community Channel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
