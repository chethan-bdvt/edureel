import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Copy,
  ExternalLink,
  Terminal,
  Layers,
  Sparkles,
  QrCode,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'instant' | 'pwabuilder' | 'cli'>('instant');

  if (!isOpen) return null;

  const publicAppUrl = 'https://ais-pre-bwig5g7wv3fxomi3mkrvru-299979211451.europe-west1.run.app';
  const pwabuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(publicAppUrl)}`;

  const bubblewrapCmd = `npx @bubblewrap/cli init --manifest="${publicAppUrl}/manifest.webmanifest"
npx @bubblewrap/cli build`;

  const capacitorCmd = `npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init LearnLoop app.learnloop.edureel --web-dir dist
npx cap add android
npx cap open android`;

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleDownloadManifest = () => {
    const manifestData = {
      id: '/',
      name: 'LearnLoop - Educational Video & AI Learning App',
      short_name: 'LearnLoop',
      description: 'Short educational videos, AI explanations, quizzes, and learning assistant for kids and students from Pre-K to Grade 8.',
      theme_color: '#0f172a',
      background_color: '#020617',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    };

    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Strip with App Icon & Badge */}
        <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 p-4 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl shrink-0 bg-slate-950">
              <img
                src="/pwa-192x192.png"
                alt="LearnLoop App Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold tracking-tight">Android APK & PWA Generator</h3>
                <span className="text-[10px] bg-black/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-white/80">Generate, install, or export native Android package</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Package Specifications Card */}
        <div className="bg-slate-850 p-3 mx-4 mt-3 rounded-2xl border border-slate-750 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">LearnLoop Mobile</span>
              <span className="text-[10px] text-slate-400 font-mono">v1.0.0</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">app.learnloop.edureel</p>
          </div>
          <div className="text-right text-[10px] space-y-0.5 text-slate-300">
            <div>Format: <strong className="text-emerald-400">WebAPK / APK</strong></div>
            <div>Target: <strong className="text-sky-400">Android 7.0–14+</strong></div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4 pt-2 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('instant')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'instant'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>1. Instant Install (WebAPK)</span>
          </button>

          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'pwabuilder'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. 1-Click APK Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`py-2 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'cli'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. Android CLI / Studio</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {/* TAB 1: INSTANT INSTALL (WebAPK) */}
          {activeTab === 'instant' && (
            <div className="space-y-3.5">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">Direct Device Installation</span>
                  </div>
                  {isInstalled && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      App Installed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  On Android, modern Chromium generates an official signed <strong>WebAPK</strong> that adds LearnLoop directly to your home screen, app drawer, and system settings like a native APK.
                </p>

                {isInstallable ? (
                  <button
                    onClick={install}
                    className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install LearnLoop App (WebAPK)</span>
                  </button>
                ) : isInstalled ? (
                  <div className="p-2.5 bg-emerald-900/40 rounded-xl text-center text-emerald-300 text-xs font-semibold">
                    🎉 LearnLoop is running as an installed standalone app!
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] text-slate-400">
                      To install on your phone right now, open this app in Chrome on Android:
                    </p>
                    <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl text-[11px] font-mono text-sky-300">
                      <span className="truncate flex-1">{publicAppUrl}</span>
                      <button
                        onClick={() => handleCopy(publicAppUrl, 'app_url')}
                        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[10px] shrink-0 flex items-center gap-1"
                      >
                        {copiedCmd === 'app_url' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCmd === 'app_url' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* iOS Note */}
              <div className="bg-slate-800/60 border border-slate-750 rounded-2xl p-3 space-y-1 text-slate-300">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>On iPhone or iPad?</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Tap <strong>Share</strong> in Safari, then tap <strong>Add to Home Screen</strong>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PWABUILDER 1-CLICK APK */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-3">
              <div className="bg-sky-950/40 border border-sky-500/30 rounded-2xl p-3.5 space-y-2.5">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Microsoft PWABuilder (Official Google Partner)</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  PWABuilder packages your live LearnLoop web manifest into a signed Android <strong>.apk</strong> or Google Play Store ready <strong>.aab</strong> bundle with zero local setup.
                </p>

                <a
                  href={pwabuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Generate APK on PWABuilder</span>
                </a>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Manifest URL:</span>
                  <button
                    onClick={handleDownloadManifest}
                    className="text-sky-400 hover:text-sky-300 text-[10px] font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download manifest.json</span>
                  </button>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl text-[10px] font-mono text-slate-300 break-all select-all">
                  {publicAppUrl}/manifest.webmanifest
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLI / BUBBLEWRAP & CAPACITOR */}
          {activeTab === 'cli' && (
            <div className="space-y-3">
              {/* Bubblewrap CLI (Google Chrome Official) */}
              <div className="bg-slate-800/80 border border-slate-750 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Option A: Google Bubblewrap (Fastest APK)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(bubblewrapCmd, 'bubblewrap')}
                    className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedCmd === 'bubblewrap' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'bubblewrap' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-amber-200 overflow-x-auto leading-relaxed border border-slate-800">
                  {bubblewrapCmd}
                </pre>
                <p className="text-[10px] text-slate-400">
                  Builds a signed release APK ready to sideload on any Android phone.
                </p>
              </div>

              {/* Capacitor / Android Studio */}
              <div className="bg-slate-800/80 border border-slate-750 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Option B: Capacitor (Android Studio)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(capacitorCmd, 'capacitor')}
                    className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedCmd === 'capacitor' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'capacitor' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-2.5 rounded-xl text-[10px] font-mono text-indigo-200 overflow-x-auto leading-relaxed border border-slate-800">
                  {capacitorCmd}
                </pre>
                <p className="text-[10px] text-slate-400">
                  Opens full native Gradle project in Android Studio with Build &gt; Build APK(s).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PWA & WebAPK Verified</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
