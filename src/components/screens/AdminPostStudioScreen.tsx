import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Upload,
  CheckCircle,
  HelpCircle,
  BookOpen,
  ListChecks,
  Film,
} from 'lucide-react';
import { ReelVideo, SubjectCategory, GradeLevel, AnimationType } from '../../types';

interface AdminPostStudioScreenProps {
  onBack: () => void;
  onPublishReel: (newReel: ReelVideo) => void;
}

export const AdminPostStudioScreen: React.FC<AdminPostStudioScreenProps> = ({
  onBack,
  onPublishReel,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('Science');
  const [grade, setGrade] = useState<GradeLevel>('Grade 6-8');
  const [duration, setDuration] = useState('1:00');
  const [animationType, setAnimationType] = useState<AnimationType>('science');
  const [summary, setSummary] = useState('');
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [point3, setPoint3] = useState('');
  const [audioScript, setAudioScript] = useState('');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [showPublishedToast, setShowPublishedToast] = useState(false);

  const handleFillSample = () => {
    setTitle('How Rainbows Form in the Sky');
    setSubtitle('Sunlight refraction through raindrops explained');
    setSubject('Science');
    setGrade('Grade 3-5');
    setDuration('1:05');
    setAnimationType('science');
    setSummary('Rainbows are formed when white sunlight passes through millions of falling raindrops, splitting into vibrant spectral colors.');
    setPoint1('Sunlight bends (refracts) as it enters a water droplet.');
    setPoint2('Different colors bend at different angles, separating into red, orange, yellow, green, blue, indigo, and violet.');
    setPoint3('The light reflects off the back of the droplet and into your eyes.');
    setAudioScript('Ever seen a brilliant rainbow after a summer shower? When white light from the Sun hits a falling raindrop, it slows down and bends. Like a glass prism, each color bends at a unique angle, casting a magical colorful arc across the sky!');
    setQuizQuestion('What causes white sunlight to separate into colors inside a raindrop?');
    setOptionA('Refraction and reflection');
    setOptionB('Gravity pulling colors down');
    setOptionC('Wind blowing colors apart');
    setCorrectOptionIndex(0);
    setExplanation('Refraction bends light waves by varying amounts according to their wavelength, separating white light into the visible spectrum.');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    let imageAsset = '/src/assets/images/reel_cell_structure_1792219499595.jpg';
    if (animationType === 'space') imageAsset = '/src/assets/images/reel_solar_system_1792219498469.jpg';
    if (animationType === 'math') imageAsset = '/src/assets/images/reel_algebra_basics_1792219499608.jpg';
    if (animationType === 'safari' || grade === 'Nursery & Pre-K') imageAsset = '/src/assets/images/reel_prek_safari_1792219499580.jpg';

    const newReel: ReelVideo = {
      id: `admin_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `Explore ${title} in under a minute!`,
      subject,
      grade,
      duration,
      author: {
        name: 'LearnLoop Curriculum Admin',
        handle: '@admin_curriculum',
        avatar: '🛡️',
        gradeBadge: `Official • ${grade}`,
        verified: true,
        isOfficialAdmin: true,
      },
      likes: 120,
      commentsCount: 14,
      sharesCount: 35,
      tags: [`#${subject.toLowerCase().replace(/\s+/g, '')}`, '#learnloop', '#official'],
      summary: summary.trim(),
      keyPoints: [
        point1.trim() || 'Core concept foundational understanding.',
        point2.trim() || 'Interactive real-world application.',
        point3.trim() || 'Key takeaway for tests and homework.',
      ],
      audioScript: audioScript.trim() || `Welcome to today's micro-lesson on ${title}. ${summary}`,
      quiz: {
        question: quizQuestion.trim() || `What is the key insight of ${title}?`,
        options: [
          optionA.trim() || 'Option A',
          optionB.trim() || 'Option B',
          optionC.trim() || 'Option C',
        ],
        correctIndex: correctOptionIndex,
        explanation: explanation.trim() || 'Correct understanding of the fundamental principle.',
      },
      imageAsset,
      animationType,
      isUserCreated: false,
      createdAt: 'Just now',
      isLiked: false,
      isSaved: false,
    };

    onPublishReel(newReel);
    setShowPublishedToast(true);
    setTimeout(() => {
      setShowPublishedToast(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="text-sm font-bold text-white">Admin Content Studio</h2>

        <button
          type="button"
          onClick={handleFillSample}
          className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
        >
          Fill Sample
        </button>
      </div>

      <form onSubmit={handlePublish} className="space-y-4 text-xs">
        {/* Basic Metadata */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-3">
          <h3 className="font-bold text-sky-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Reel Metadata</span>
          </h3>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Video Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How Rainbows Form in the Sky"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Subtitle / Hook</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Sunlight refraction through raindrops"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Subject Category</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Nursery & Pre-K">Nursery & Pre-K</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Target Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Nursery & Pre-K">Nursery & Pre-K</option>
                <option value="Grade 1-2">Grade 1-2</option>
                <option value="Grade 3-5">Grade 3-5</option>
                <option value="Grade 6-8">Grade 6-8</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Animation Style</label>
              <select
                value={animationType}
                onChange={(e) => setAnimationType(e.target.value as AnimationType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="science">Laboratory / Science</option>
                <option value="space">Space / Astronomy</option>
                <option value="biology">Cell Biology</option>
                <option value="math">Chalkboard Math</option>
                <option value="safari">Pre-K Safari Cartoon</option>
                <option value="history">Historical Map</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Duration (Cap 720p)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="1:00"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Learning Summary & Takeaways */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-3">
          <h3 className="font-bold text-sky-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Summary & Key Points</span>
          </h3>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Summary Text *</label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="2 impactful sentences explaining the topic..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-semibold">3 Key Learning Points</label>
            <input
              type="text"
              value={point1}
              onChange={(e) => setPoint1(e.target.value)}
              placeholder="1. First key takeaway"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500"
            />
            <input
              type="text"
              value={point2}
              onChange={(e) => setPoint2(e.target.value)}
              placeholder="2. Second key takeaway"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500"
            />
            <input
              type="text"
              value={point3}
              onChange={(e) => setPoint3(e.target.value)}
              placeholder="3. Third key takeaway"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Voice Narration Script</label>
            <textarea
              rows={2}
              value={audioScript}
              onChange={(e) => setAudioScript(e.target.value)}
              placeholder="Conversational script read aloud by the audio engine..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Interactive Quiz Builder */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-3">
          <h3 className="font-bold text-sky-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Quiz Builder</span>
          </h3>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Quiz Question</label>
            <input
              type="text"
              value={quizQuestion}
              onChange={(e) => setQuizQuestion(e.target.value)}
              placeholder="What causes white light to split into a rainbow?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-semibold">Options (Select radio for correct answer)</label>
            {[
              { val: optionA, set: setOptionA, idx: 0, label: 'Option A' },
              { val: optionB, set: setOptionB, idx: 1, label: 'Option B' },
              { val: optionC, set: setOptionC, idx: 2, label: 'Option C' },
            ].map((opt) => (
              <div key={opt.idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionIndex === opt.idx}
                  onChange={() => setCorrectOptionIndex(opt.idx)}
                  className="w-4 h-4 text-sky-500 focus:ring-sky-400"
                />
                <input
                  type="text"
                  value={opt.val}
                  onChange={(e) => opt.set(e.target.value)}
                  placeholder={opt.label}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500"
                />
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Explanation</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why this answer is correct..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 pb-6">
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Publish Reel to LearnLoop</span>
          </button>
        </div>
      </form>

      {/* Published Toast */}
      {showPublishedToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>Reel Published Successfully!</span>
        </div>
      )}
    </div>
  );
};
