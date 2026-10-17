import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenApkModal?: () => void;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenApkModal, className }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (isInstalled) return null;

  return (
    <button
      onClick={() => {
        if (isInstallable) {
          install();
        } else if (onOpenApkModal) {
          onOpenApkModal();
        }
      }}
      className={
        className ||
        'flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all'
      }
      title="Install LearnLoop app / Generate APK"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App / APK</span>
    </button>
  );
};
