import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Subtitles,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  BookOpen,
  ListChecks,
} from 'lucide-react';
import { ReelVideo } from '../../types';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface DetailedViewScreenProps {
  reel: ReelVideo;
  onBack: () => void;
  onQuizComplete?: (passed: boolean) => void;
}

export const DetailedViewScreen: React.FC<DetailedViewScreenProps> = ({
  reel,
  onBack,
  onQuizComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'key_points' | 'quiz'>('summary');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isCCActive, setIsCCActive] = useState(true);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Audio Narration Hook
  const { isPlaying: isAudioPlaying, progress: audioProgress, toggle: toggleAudio } = useSpeechSynthesis();

  const handleSelectOption = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(index);
    setQuizSubmitted(true);
    if (onQuizComplete) {
      onQuizComplete(index === reel.quiz.correctIndex);
    }
  };

  const handleResetQuiz = () => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-y-auto select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Back to feed"
          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="text-sm font-bold text-white truncate max-w-[200px] text-center">
          {reel.title}
        </h1>

        <div className="w-8 h-8" /> {/* spacer */}
      </div>

      {/* 720p Video Player Stage */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden group">
        <img
          src={reel.imageAsset}
          alt={reel.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isVideoPlaying ? 'scale-100' : 'scale-98 brightness-90'
          }`}
        />

        {/* CC Subtitle overlay */}
        {isCCActive && (
          <div className="absolute bottom-10 left-4 right-4 bg-black/75 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center text-xs text-white border border-white/10">
            {reel.audioScript.slice(0, 85)}...
          </div>
        )}

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <span className="text-[11px] font-mono text-slate-300">0:15 / {reel.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCCActive(!isCCActive)}
              className={`p-1 rounded text-xs font-bold ${
                isCCActive ? 'text-sky-400 bg-sky-950/60' : 'text-slate-400'
              }`}
            >
              <Subtitles className="w-4 h-4" />
            </button>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              720p
            </span>
          </div>
        </div>
      </div>

      {/* Title & Metadata Details */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <span>{reel.subject}</span>
            <span>·</span>
            <span className="bg-sky-950/80 px-2 py-0.5 rounded text-[10px] text-sky-300 border border-sky-500/20">
              {reel.grade}
            </span>
            <span>·</span>
            <span className="text-slate-400">{reel.duration}</span>
          </div>
          <h2 className="text-base font-bold text-white leading-snug">{reel.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{reel.subtitle}</p>
        </div>

        {/* Audio Narration Bar */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-sky-400" />
              <span>Voice Narration</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {isAudioPlaying ? `${audioProgress}%` : 'Ready to listen'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleAudio(reel.audioScript)}
              className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
            >
              {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-400 h-full transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Segmented Concept Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'summary' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('key_points')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'key_points' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Key Points</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'quiz' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="pt-2">
          {activeTab === 'summary' && (
            <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Concept Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{reel.summary}</p>
            </div>
          )}

          {activeTab === 'key_points' && (
            <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Essential Takeaways</h4>
              <ul className="space-y-2">
                {reel.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Check Understanding</span>
                </span>
                {quizSubmitted && (
                  <button
                    onClick={handleResetQuiz}
                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Try Again
                  </button>
                )}
              </div>

              <p className="text-xs font-semibold text-white leading-snug">{reel.quiz.question}</p>

              <div className="space-y-2">
                {reel.quiz.options.map((option, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === reel.quiz.correctIndex;

                  let buttonStyle = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-sky-600 border-sky-400 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={quizSubmitted}
                      className={`w-full p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all active:scale-98 ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {quizSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div
                  className={`p-3 rounded-xl text-xs space-y-1 ${
                    selectedQuizOption === reel.quiz.correctIndex
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  <p className="font-bold">
                    {selectedQuizOption === reel.quiz.correctIndex ? '🎉 Excellent Job!' : 'Not quite right!'}
                  </p>
                  <p className="text-slate-300 text-[11px]">{reel.quiz.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
