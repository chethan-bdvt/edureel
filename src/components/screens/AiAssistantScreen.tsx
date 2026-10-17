import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GradeLevel, ReelVideo } from '../../types';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedVideo?: {
    title: string;
    duration: string;
    subject: string;
    grade: string;
    promptTopic: string;
  };
  time: string;
}

interface AiAssistantScreenProps {
  currentGrade: GradeLevel;
  onOpenVideo: (title: string, subject: string, grade: string) => void;
  onRequestCustomVideo: (prompt: string, subject: string) => void;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({
  currentGrade,
  onOpenVideo,
  onRequestCustomVideo,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Explain photosynthesis in a simple way for grade 6',
      time: '9:41 AM',
    },
    {
      id: 'm2',
      sender: 'bot',
      text: 'Hoo-hoo! A wise inquiry, young scholar! Let me conjure a fun animated reel showing how green leaves cook food with pure sunlight. 🌱🦉',
      suggestedVideo: {
        title: 'Photosynthesis Explained',
        duration: '1 min',
        subject: 'Science',
        grade: 'Grade 6-8',
        promptTopic: 'Photosynthesis',
      },
      time: '9:41 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stop: stopSpeech, isPlaying: isSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          grade: currentGrade,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply || `That's a fantastic question about ${textToSend}! Let me show you how it works!`,
        suggestedVideo: data.suggestedVideo,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speak(botMsg.text);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `Great curiosity! In ${currentGrade}, exploring "${textToSend}" helps us uncover how science and nature connect.`,
        suggestedVideo: {
          title: textToSend.charAt(0).toUpperCase() + textToSend.slice(1),
          duration: '1 min',
          subject: 'Science',
          grade: currentGrade,
          promptTopic: textToSend,
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speak(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsRecording(false);
          handleSendMessage(transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognition.start();
      } catch (e) {
        setIsRecording(false);
        simulateVoiceInput();
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const sampleQueries = [
        'Why is the sky blue?',
        'How do birds fly without an engine?',
        'What are fractions?',
        'Can you show me animal sounds for pre-k?',
      ];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      handleSendMessage(randomQuery);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-400/40 shadow-md shadow-amber-500/10 shrink-0 bg-slate-800">
            <img
              src="/src/assets/images/mascot_owl_master_1792220246986.jpg"
              alt="Owl Master Hoot"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white leading-tight">Owl Master Hoot</h1>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                AI Mentor
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">Hoo-Hoo! Ready for {currentGrade}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isSpeaking) stopSpeech();
          }}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro Banner */}
        <div className="text-center p-3 bg-sky-950/40 border border-sky-500/20 rounded-2xl max-w-xs mx-auto">
          <p className="text-xs text-sky-200">
            Ask a question or request a custom video on any subject!
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-white rounded-br-none'
                  : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>

              {/* Embedded Video Card if suggested */}
              {msg.suggestedVideo && (
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl">
                  <div className="relative w-16 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src="/src/assets/images/reel_cell_structure_1792219499595.jpg"
                      alt={msg.suggestedVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[11px] text-white truncate">{msg.suggestedVideo.title}</p>
                    <p className="text-[10px] text-slate-400">
                      {msg.suggestedVideo.grade} · {msg.suggestedVideo.duration}
                    </p>
                    <button
                      onClick={() =>
                        onOpenVideo(
                          msg.suggestedVideo!.title,
                          msg.suggestedVideo!.subject,
                          msg.suggestedVideo!.grade
                        )
                      }
                      className="mt-1 text-[10px] font-bold text-sky-400 hover:text-sky-300"
                    >
                      ▶ Watch Now
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 px-1">{msg.time}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 p-3 rounded-2xl w-fit">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Owl Master Hoot is consulting the scrolls...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onRequestCustomVideo('Explain photosynthesis in simple steps', 'Science')}
          className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-sky-300 rounded-full border border-sky-500/20"
        >
          + Create a new video
        </button>
        <button
          onClick={() => handleSendMessage('How does gravity work on Mars?')}
          className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded-full border border-slate-700"
        >
          Ask another question
        </button>
        <button
          onClick={() => handleSendMessage('Sing an ABC safari animal rhyme for Pre-K')}
          className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-pink-300 rounded-full border border-pink-500/20"
        >
          🦁 Pre-K Safari Song
        </button>
      </div>

      {/* Big Voice Button & Text Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col items-center gap-2">
        {/* Prominent Tap to Speak button */}
        <button
          onClick={handleToggleVoice}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${
            isRecording
              ? 'bg-rose-500 animate-pulse shadow-rose-500/30'
              : 'bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-sky-500/30 hover:brightness-110'
          }`}
        >
          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <span className="text-[11px] font-semibold text-slate-400">
          {isRecording ? 'Listening... Speak now!' : 'Tap to speak'}
        </span>

        {/* Text Input Row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="w-full flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or topic..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
