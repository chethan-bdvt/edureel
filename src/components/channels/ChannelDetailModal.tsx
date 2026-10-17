import React, { useState } from 'react';
import {
  X,
  Lock,
  Globe,
  Users,
  Video,
  Play,
  UserPlus,
  CheckCircle2,
  Sparkles,
  Share2,
  Copy,
  Clock,
  UserCheck,
  UserX,
  AtSign,
  Search,
} from 'lucide-react';
import {
  CommunityChannel,
  ReelVideo,
  AuthUser,
  EnrolledStudent,
  GradeLevel,
  JoinRequest,
  StudentProfile,
} from '../../types';

interface ChannelDetailModalProps {
  channel: CommunityChannel;
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  activeStudent: StudentProfile | null;
  reels: ReelVideo[];
  onSelectReel: (reel: ReelVideo) => void;
  onJoinChannel: (channelId: string) => void;
  onRequestJoinChannel: (channelId: string, request: JoinRequest) => void;
  onApproveJoinRequest: (channelId: string, requestId: string) => void;
  onDeclineJoinRequest: (channelId: string, requestId: string) => void;
  onAddStudentToChannel: (channelId: string, student: EnrolledStudent) => void;
  onPostVideoToChannel: (channelId: string, videoId: string) => void;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  channel,
  isOpen,
  onClose,
  currentUser,
  activeStudent,
  reels,
  onSelectReel,
  onJoinChannel,
  onRequestJoinChannel,
  onApproveJoinRequest,
  onDeclineJoinRequest,
  onAddStudentToChannel,
  onPostVideoToChannel,
}) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'students' | 'requests'>('reels');
  const [addMode, setAddMode] = useState<'username' | 'manual'>('username');
  const [usernameInput, setUsernameInput] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number>(12);
  const [studentGrade, setStudentGrade] = useState<GradeLevel>('Grade 6-8');

  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [showPasscodePrompt, setShowPasscodePrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTeacherOwner =
    currentUser?.role === 'teacher' &&
    currentUser?.teacherProfile?.id === channel.teacherId;

  const isEnrolled =
    currentUser?.joinedChannelIds.includes(channel.id) ||
    channel.enrolledStudents.some((s) =>
      currentUser?.students.some((cs) => cs.id === s.id || cs.username === s.username)
    );

  const hasPendingRequest = channel.pendingRequests?.some(
    (req) =>
      req.studentId === activeStudent?.id ||
      req.username === activeStudent?.username
  );

  // Filter channel reels
  const channelReels = reels.filter((r) => channel.videoIds.includes(r.id) || r.channelId === channel.id);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(channel.inviteLink || window.location.href);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleRequestJoinClick = () => {
    if (channel.isPrivate) {
      setShowPasscodePrompt(true);
    } else if (activeStudent) {
      const newRequest: JoinRequest = {
        id: `req_${Date.now()}`,
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        username: activeStudent.username || `@${activeStudent.name.toLowerCase().replace(/\s+/g, '')}`,
        age: activeStudent.age,
        grade: activeStudent.grade,
        requestedAt: 'Just now',
      };
      onRequestJoinChannel(channel.id, newRequest);
      setActionSuccessMsg('Join request sent to teacher for approval!');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasscode.trim().toUpperCase() === (channel.passcode || '').toUpperCase()) {
      onJoinChannel(channel.id);
      setShowPasscodePrompt(false);
      setPasscodeError(false);
      setActionSuccessMsg('Passcode verified! You joined the class.');
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } else {
      setPasscodeError(true);
    }
  };

  const handleAddByUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let clean = usernameInput.trim();
    if (!clean) return;
    if (!clean.startsWith('@')) clean = '@' + clean;

    const newEnrolled: EnrolledStudent = {
      id: `enr_${Date.now()}`,
      name: clean.slice(1).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      username: clean,
      age: 12,
      grade: 'Grade 6-8',
      joinedAt: 'Added by teacher',
    };

    onAddStudentToChannel(channel.id, newEnrolled);
    setUsernameInput('');
    setActionSuccessMsg(`Added student ${clean} to the channel!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleManualAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const cleanUsername = '@' + studentName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') + `_${studentAge}`;
    const newEnrolled: EnrolledStudent = {
      id: `enr_${Date.now()}`,
      name: studentName.trim(),
      username: cleanUsername,
      age: Number(studentAge),
      grade: studentGrade,
      joinedAt: 'Added by teacher',
    };

    onAddStudentToChannel(channel.id, newEnrolled);
    setStudentName('');
    setActionSuccessMsg(`Enrolled ${newEnrolled.name} (${newEnrolled.username})!`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Banner Cover with Share Link */}
        <div className={`w-full h-24 bg-gradient-to-r ${channel.coverColor} relative p-4 flex items-end justify-between`}>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {/* Share / Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-sm transition-all"
              title="Share Invite Link with Students"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Invite Link'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                channel.isPrivate
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {channel.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              <span>{channel.isPrivate ? 'Private Channel' : 'Public Channel'}</span>
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-2xl shadow-xl absolute -bottom-5 left-4">
            {channel.teacherAvatar}
          </div>
        </div>

        {/* Channel Details Header */}
        <div className="pt-7 px-4 pb-3 border-b border-slate-800 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-white leading-snug">{channel.name}</h2>
              <p className="text-xs text-slate-400">Created by {channel.teacherName}</p>
            </div>

            {/* Student Action Status (Enrolled / Pending / Join) */}
            {isEnrolled ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Joined</span>
              </span>
            ) : hasPendingRequest ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Request Pending</span>
              </span>
            ) : (
              <button
                onClick={handleRequestJoinClick}
                className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              >
                Request to Join
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{channel.description}</p>

          {/* Invite Link Info Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px]">
            <span className="text-slate-400 truncate max-w-[240px] font-mono text-[10px]">
              {channel.inviteLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionSuccessMsg && (
          <div className="mx-4 mt-2 p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Passcode Verification Modal Overlay */}
        {showPasscodePrompt && (
          <div className="p-3 mx-4 my-2 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Enter Private Class Passcode</span>
              </span>
              <button onClick={() => setShowPasscodePrompt(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-300">
              Ask {channel.teacherName} for the access code to join:
            </p>
            <form onSubmit={handleVerifyPasscode} className="flex gap-2">
              <input
                type="text"
                value={enteredPasscode}
                onChange={(e) => {
                  setEnteredPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="e.g. MATH101"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs"
              >
                Verify & Join
              </button>
            </form>
            {passcodeError && (
              <p className="text-[10px] text-rose-400">Incorrect code. Hint: check with teacher.</p>
            )}
          </div>
        )}

        {/* Tab Switcher: Class Reels | Students | Teacher Pending Requests */}
        <div className="flex border-b border-slate-800 bg-slate-850 px-4 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('reels')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'reels'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Class Reels ({channelReels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'students'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Students ({channel.enrolledStudents.length})</span>
          </button>

          {/* Teacher Only Tab: Join Requests */}
          {isTeacherOwner && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'requests'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                Join Requests
                {channel.pendingRequests?.length > 0 && (
                  <span className="ml-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                    {channel.pendingRequests.length}
                  </span>
                )}
              </span>
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* TAB 1: REELS */}
          {activeTab === 'reels' && (
            <div className="space-y-3">
              {isTeacherOwner && (
                <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Post Reel to Channel</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">Publish lessons to enrolled students</p>
                  </div>
                  <button
                    onClick={() => {
                      if (reels.length > 0) {
                        const candidate = reels.find((r) => !channel.videoIds.includes(r.id)) || reels[0];
                        onPostVideoToChannel(channel.id, candidate.id);
                        setActionSuccessMsg(`Shared "${candidate.title}" with the class!`);
                        setTimeout(() => setActionSuccessMsg(null), 3000);
                      }
                    }}
                    className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-white text-[11px] font-bold rounded-lg"
                  >
                    + Share Reel
                  </button>
                </div>
              )}

              {channelReels.length === 0 ? (
                <div className="text-center p-6 text-slate-400 space-y-1">
                  <Video className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">No reels shared in this channel yet.</p>
                  <p className="text-[10px]">
                    {isTeacherOwner ? 'Post your first curriculum reel above!' : 'Check back soon for class lessons.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {channelReels.map((reel) => (
                    <div
                      key={reel.id}
                      onClick={() => {
                        onSelectReel(reel);
                        onClose();
                      }}
                      className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden cursor-pointer group hover:border-sky-500 transition-all"
                    >
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img src={reel.imageAsset} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-current opacity-90 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 px-1 rounded text-white font-mono">
                          {reel.duration}
                        </span>
                      </div>
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{reel.title}</h4>
                        <p className="text-[10px] text-sky-400 mt-0.5">{reel.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STUDENTS */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              {/* Teacher Add Student Controls: by Username or Manual */}
              {isTeacherOwner && (
                <div className="p-3 bg-slate-850 rounded-2xl border border-slate-750 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-sky-400" />
                      <span>Add Student to Channel</span>
                    </span>

                    <div className="flex bg-slate-800 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setAddMode('username')}
                        className={`px-2 py-0.5 rounded font-semibold ${
                          addMode === 'username' ? 'bg-sky-500 text-white' : 'text-slate-400'
                        }`}
                      >
                        By @Username
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddMode('manual')}
                        className={`px-2 py-0.5 rounded font-semibold ${
                          addMode === 'manual' ? 'bg-sky-500 text-white' : 'text-slate-400'
                        }`}
                      >
                        Manual
                      </button>
                    </div>
                  </div>

                  {/* Mode A: Add by Unique Username */}
                  {addMode === 'username' ? (
                    <form onSubmit={handleAddByUsernameSubmit} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <AtSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="chethan or arjun_math"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-slate-500 text-xs font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!usernameInput.trim()}
                          className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-bold rounded-xl text-xs"
                        >
                          Add
                        </button>
                      </div>

                      {/* Quick Suggestions for Registered Users */}
                      <div className="flex items-center gap-1 flex-wrap text-[10px] text-slate-400">
                        <span>Quick add:</span>
                        {['@chethan', '@ananya_prek', '@rohan_gr3', '@samira_k'].map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setUsernameInput(u)}
                            className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-750 rounded text-sky-300 font-mono"
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </form>
                  ) : (
                    /* Mode B: Manual name / age / grade */
                    <form onSubmit={handleManualAddStudentSubmit} className="space-y-2">
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Student Full Name (e.g. Maya)"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={2}
                          max={18}
                          value={studentAge}
                          onChange={(e) => setStudentAge(Number(e.target.value))}
                          placeholder="Age"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white"
                        />

                        <select
                          value={studentGrade}
                          onChange={(e) => setStudentGrade(e.target.value as GradeLevel)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-1.5 py-1 text-white text-[11px]"
                        >
                          <option value="Nursery & Pre-K">Pre-K</option>
                          <option value="Grade 1-2">Grades 1-2</option>
                          <option value="Grade 3-5">Grades 3-5</option>
                          <option value="Grade 6-8">Grades 6-8</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg shadow-sm"
                      >
                        Enroll Student
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Enrolled Students list */}
              <div className="space-y-1.5">
                {channel.enrolledStudents.map((st) => (
                  <div
                    key={st.id}
                    className="bg-slate-800/60 border border-slate-750 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white">{st.name}</h4>
                          <span className="text-[10px] text-sky-400 font-mono">{st.username}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Age {st.age} · {st.grade}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500">{st.joinedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JOIN REQUESTS (Teacher Approval) */}
          {activeTab === 'requests' && isTeacherOwner && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Pending Requests ({channel.pendingRequests?.length || 0})</span>
                <span className="text-[10px] text-slate-400">Invited via channel link</span>
              </div>

              {!channel.pendingRequests || channel.pendingRequests.length === 0 ? (
                <div className="text-center p-6 text-slate-400 space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/60 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">All caught up!</p>
                  <p className="text-[10px]">No pending join requests. Share your link to invite more students.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {channel.pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 bg-slate-800/80 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs animate-in slide-in-from-top-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center">
                          {req.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-white">{req.studentName}</h4>
                            <span className="text-[10px] text-amber-300 font-mono">{req.username}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Age {req.age} · {req.grade} · {req.requestedAt}
                          </p>
                        </div>
                      </div>

                      {/* Approve / Decline Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onApproveJoinRequest(channel.id, req.id);
                            setActionSuccessMsg(`Approved ${req.studentName} to join!`);
                            setTimeout(() => setActionSuccessMsg(null), 3000);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg text-[11px] shadow-sm transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            onDeclineJoinRequest(channel.id, req.id);
                            setActionSuccessMsg(`Declined request from ${req.studentName}.`);
                            setTimeout(() => setActionSuccessMsg(null), 3000);
                          }}
                          className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Decline"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
