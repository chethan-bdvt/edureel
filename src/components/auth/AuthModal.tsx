import React, { useState } from 'react';
import {
  X,
  Mail,
  Key,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Send,
  Baby,
} from 'lucide-react';
import {
  UserRole,
  GradeLevel,
  SubjectCategory,
  AuthUser,
  StudentProfile,
  TeacherProfile,
} from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

const ALL_SUBJECTS: SubjectCategory[] = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Computer Science',
  'Languages',
  'Nursery & Pre-K',
];

const GRADE_LEVELS: GradeLevel[] = [
  'Nursery & Pre-K',
  'Grade 1-2',
  'Grade 3-5',
  'Grade 6-8',
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [authMethod, setAuthMethod] = useState<'password' | 'verification_link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [step, setStep] = useState<'credentials' | 'role_details'>('credentials');

  // Role
  const [role, setRole] = useState<UserRole>('student');

  // Teacher fields
  const [teacherName, setTeacherName] = useState('');
  const [teacherSubjects, setTeacherSubjects] = useState<SubjectCategory[]>(['Science', 'Mathematics']);
  const [schoolOrg, setSchoolOrg] = useState('');

  // Primary Student fields
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number>(12);
  const [studentGrade, setStudentGrade] = useState<GradeLevel>('Grade 6-8');

  // Sibling fields
  const [siblingsList, setSiblingsList] = useState<
    Array<{ id: string; name: string; age: number; grade: GradeLevel; avatar: string }>
  >([]);

  if (!isOpen) return null;

  const toggleTeacherSubject = (subj: SubjectCategory) => {
    setTeacherSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleSendVerificationLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setCodeSent(true);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (authMethod === 'password' && !password.trim()) return;
    if (authMethod === 'verification_link' && !verificationCode.trim()) {
      setCodeSent(true);
      return;
    }
    setStep('role_details');
  };

  const handleAddSibling = () => {
    const defaultGrade: GradeLevel = siblingsList.length === 0 ? 'Nursery & Pre-K' : 'Grade 1-2';
    const defaultAge = siblingsList.length === 0 ? 4 : 7;
    const avatars = ['👧🏻', '🧒🏾', '👶🏽', '👦🏼', '👧🏼'];
    const randomAvatar = avatars[siblingsList.length % avatars.length];

    setSiblingsList((prev) => [
      ...prev,
      {
        id: `sib_${Date.now()}`,
        name: `Sibling ${prev.length + 1}`,
        age: defaultAge,
        grade: defaultGrade,
        avatar: randomAvatar,
      },
    ]);
  };

  const handleUpdateSibling = (
    id: string,
    field: 'name' | 'age' | 'grade',
    val: any
  ) => {
    setSiblingsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleRemoveSibling = (id: string) => {
    setSiblingsList((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'teacher') {
      const teacherProfile: TeacherProfile = {
        id: `t_${Date.now()}`,
        name: teacherName.trim() || 'Teacher ' + email.split('@')[0],
        subjects: teacherSubjects.length > 0 ? teacherSubjects : ['Science'],
        schoolOrOrg: schoolOrg.trim() || 'LearnLoop Academy',
        avatar: '👩🏻‍🏫',
        verified: true,
      };

      const newUser: AuthUser = {
        id: `usr_${Date.now()}`,
        email,
        role: 'teacher',
        authMethod,
        teacherProfile,
        students: [],
        joinedChannelIds: [],
      };

      onAuthSuccess(newUser);
      onClose();
    } else {
      // Student + Siblings
      const cleanUsername = '@' + (studentName.trim() || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '');
      const primaryStudent: StudentProfile = {
        id: `s_primary_${Date.now()}`,
        name: studentName.trim() || 'Student ' + email.split('@')[0],
        username: cleanUsername,
        age: studentAge,
        grade: studentGrade,
        avatar: studentGrade === 'Nursery & Pre-K' ? '👶🏽' : '👦🏽',
        overallProgress: 10,
        videosWatched: 1,
        isPrimary: true,
      };

      const siblingProfiles: StudentProfile[] = siblingsList.map((s, idx) => ({
        id: s.id,
        name: s.name.trim() || 'Sibling',
        username: '@' + (s.name.trim() || `sibling_${idx + 1}`).toLowerCase().replace(/[^a-z0-9_]/g, '') + `_${s.age}`,
        age: Number(s.age),
        grade: s.grade,
        avatar: s.avatar,
        overallProgress: 0,
        videosWatched: 0,
        isPrimary: false,
      }));

      const allStudents = [primaryStudent, ...siblingProfiles];

      const newUser: AuthUser = {
        id: `usr_${Date.now()}`,
        email,
        role: 'student',
        authMethod,
        students: allStudents,
        activeStudentId: primaryStudent.id,
        joinedChannelIds: ['chan_stem_lab'],
      };

      onAuthSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            ▶
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">LearnLoop Account</h3>
            <p className="text-[10px] text-slate-400">
              {step === 'credentials' ? 'Sign in or create account' : 'Customize your profile & role'}
            </p>
          </div>
        </div>

        {/* STEP 1: Email + Password / Verification Link */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            {/* Method Tabs */}
            <div className="flex p-1 bg-slate-800/80 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  authMethod === 'password' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('verification_link')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  authMethod === 'verification_link'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Verification Link
              </button>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.or.teacher@school.edu"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Password Mode */}
            {authMethod === 'password' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-sky-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            {/* Verification Link / Magic Code Mode */}
            {authMethod === 'verification_link' && (
              <div className="space-y-2">
                {!codeSent ? (
                  <button
                    type="button"
                    onClick={handleSendVerificationLink}
                    disabled={!email.trim()}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 disabled:opacity-40 text-sky-400 font-semibold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Verification Link to Email</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2">
                    <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verification link sent to <strong>{email}</strong>!</span>
                    </p>
                    <div className="space-y-1">
                      <label className="text-slate-300 text-[10px]">Or enter verification code (test: 7788):</label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="e.g. 7788"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-center font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Step Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 active:scale-98 transition-all"
            >
              <span>Continue to Profile Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Role Selection (Teacher with Multiple Subjects vs Student with Age/Grade & Siblings) */}
        {step === 'role_details' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
            {/* Role Radio Pill Cards */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold">Who is using this account?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    role === 'student'
                      ? 'bg-sky-500/20 border-sky-400 ring-1 ring-sky-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-lg">
                    👦🏽
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Student / Family</h4>
                    <p className="text-[10px] text-slate-400">Kids & Siblings</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    role === 'teacher'
                      ? 'bg-sky-500/20 border-sky-400 ring-1 ring-sky-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-lg">
                    👩🏻‍🏫
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Teacher</h4>
                    <p className="text-[10px] text-slate-400">Class Channels & Reels</p>
                  </div>
                </button>
              </div>
            </div>

            {/* TEACHER FLOW: Multiple Subjects Selection */}
            {role === 'teacher' && (
              <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Teacher Name</label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Mrs. Sharma or Coach Dave"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">School or Organization (Optional)</label>
                  <input
                    type="text"
                    value={schoolOrg}
                    onChange={(e) => setSchoolOrg(e.target.value)}
                    placeholder="e.g. Lincoln Middle School"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Multiple Subject Checkboxes */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-slate-200 font-bold block">
                    Select Subjects You Teach <span className="text-sky-400 font-normal">(Multiple allowed)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {ALL_SUBJECTS.map((subj) => {
                      const isSelected = teacherSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleTeacherSubject(subj)}
                          className={`p-2 rounded-xl border text-left flex items-center justify-between text-[11px] transition-all ${
                            isSelected
                              ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{subj}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STUDENT FLOW: Age, Grade & Siblings */}
            {role === 'student' && (
              <div className="space-y-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Student Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Chethan"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Student Age</label>
                    <input
                      type="number"
                      min={2}
                      max={18}
                      required
                      value={studentAge}
                      onChange={(e) => setStudentAge(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Grade Level</label>
                    <select
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value as GradeLevel)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-sky-500"
                    >
                      {GRADE_LEVELS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Siblings Section */}
                <div className="pt-2 border-t border-slate-750 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        <span>Siblings on this Account</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Include siblings to switch profiles and adapt grade content
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSibling}
                      className="flex items-center gap-1 px-2 py-1 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-[10px] font-bold rounded-lg border border-pink-500/30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Sibling</span>
                    </button>
                  </div>

                  {siblingsList.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {siblingsList.map((sib, idx) => (
                        <div
                          key={sib.id}
                          className="bg-slate-850 p-2.5 rounded-xl border border-slate-750 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[11px] text-slate-200 flex items-center gap-1">
                              <span>{sib.avatar}</span>
                              <span>Sibling #{idx + 1}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSibling(sib.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                            <input
                              type="text"
                              value={sib.name}
                              onChange={(e) => handleUpdateSibling(sib.id, 'name', e.target.value)}
                              placeholder="Name"
                              className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white"
                            />
                            <input
                              type="number"
                              min={2}
                              max={18}
                              value={sib.age}
                              onChange={(e) => handleUpdateSibling(sib.id, 'age', Number(e.target.value))}
                              placeholder="Age"
                              className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white"
                            />
                            <select
                              value={sib.grade}
                              onChange={(e) => handleUpdateSibling(sib.id, 'grade', e.target.value as GradeLevel)}
                              className="bg-slate-800 border border-slate-700 rounded px-1 py-1 text-white"
                            >
                              {GRADE_LEVELS.map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit & Back buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Complete & Start Learning</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
