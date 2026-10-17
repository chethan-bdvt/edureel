import React, { useState } from 'react';
import { X, Users, Plus, Check, Sparkles, UserPlus } from 'lucide-react';
import { StudentProfile, GradeLevel } from '../types';

interface SiblingSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  activeStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onAddSibling: (newSibling: StudentProfile) => void;
}

const GRADE_LEVELS: GradeLevel[] = [
  'Nursery & Pre-K',
  'Grade 1-2',
  'Grade 3-5',
  'Grade 6-8',
];

export const SiblingSwitcherModal: React.FC<SiblingSwitcherModalProps> = ({
  isOpen,
  onClose,
  students,
  activeStudentId,
  onSelectStudent,
  onAddSibling,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(6);
  const [grade, setGrade] = useState<GradeLevel>('Grade 1-2');

  if (!isOpen) return null;

  const handleCreateSibling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const avatars = ['👧🏻', '🧒🏾', '👶🏽', '👦🏼', '👧🏼', '🧒🏻'];
    const avatar = grade === 'Nursery & Pre-K' ? '👶🏽' : avatars[students.length % avatars.length];

    const newStudent: StudentProfile = {
      id: `s_sib_${Date.now()}`,
      name: name.trim(),
      username: '@' + name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') + `_${age}`,
      age: Number(age),
      grade,
      avatar,
      overallProgress: 0,
      videosWatched: 0,
      isPrimary: false,
    };

    onAddSibling(newStudent);
    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Switch Learner Profile</h3>
              <p className="text-[10px] text-slate-400">Content adapts to their age & grade</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Siblings Profiles List */}
        <div className="space-y-2.5">
          {students.map((student) => {
            const isActive = student.id === activeStudentId;
            return (
              <div
                key={student.id}
                onClick={() => {
                  onSelectStudent(student.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
                  isActive
                    ? 'bg-sky-500/15 border-sky-400 ring-1 ring-sky-400/50 shadow-md'
                    : 'bg-slate-800/80 border-slate-750 hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl shadow-inner border border-white/5">
                    {student.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{student.name}</h4>
                      {student.isPrimary && (
                        <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-sky-400 font-medium">
                      Age {student.age} · {student.grade}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isActive ? (
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-1 rounded-lg bg-slate-800">
                      Switch
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Sibling Button / Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-pink-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sibling to Account</span>
          </button>
        ) : (
          <form
            onSubmit={handleCreateSibling}
            className="p-3 bg-slate-850 rounded-2xl border border-slate-750 space-y-2.5 text-xs animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">New Sibling Profile</span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sibling name (e.g. Ananya)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Age</label>
                <input
                  type="number"
                  min={2}
                  max={18}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-1.5 text-white text-[11px]"
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md shadow-pink-600/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Save & Add Sibling</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
