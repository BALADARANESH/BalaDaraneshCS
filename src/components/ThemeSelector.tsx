import React from 'react';
import { Sun, Moon, Zap, Sparkles } from 'lucide-react';
import { ThemeName } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onChangeTheme: (theme: ThemeName) => void;
}

export default function ThemeSelector({ currentTheme, onChangeTheme }: ThemeSelectorProps) {
  const themes = [
    {
      id: 'sleek-interface' as ThemeName,
      name: 'Sleek Interface',
      icon: Sparkles,
      bg: 'bg-[#0B0E14] text-slate-200 border-[#1E2530] hover:bg-[#151A23]',
      activeBg: 'bg-indigo-950/50 text-indigo-400 border-indigo-500'
    },
    {
      id: 'sentinel-dark' as ThemeName,
      name: 'Sentinel Dark',
      icon: Moon,
      bg: 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800',
      activeBg: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/70'
    },
    {
      id: 'electric-precision' as ThemeName,
      name: 'Electric Precision',
      icon: Zap,
      bg: 'bg-black text-lime-400 border-zinc-800 hover:bg-zinc-950',
      activeBg: 'bg-lime-950/35 text-lime-400 border-lime-400'
    },
    {
      id: 'sentinel-light' as ThemeName,
      name: 'Sentinel Light',
      icon: Sun,
      bg: 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50',
      activeBg: 'bg-slate-100 text-emerald-700 border-emerald-500'
    }
  ];

  return (
    <div className="flex items-center space-x-2" id="theme-selector-container">
      <span className="text-xs font-mono uppercase opacity-60 mr-1 hidden sm:inline">Theme Profile:</span>
      <div className="flex p-1 bg-slate-100 dark:bg-zinc-900/60 rounded-lg border border-slate-200 dark:border-zinc-800">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = currentTheme === t.id;
          return (
            <button
              key={t.id}
              id={`theme-btn-${t.id}`}
              onClick={() => onChangeTheme(t.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all border ${
                isActive ? t.activeBg : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              title={t.name}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
