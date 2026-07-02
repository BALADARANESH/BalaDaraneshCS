import React from 'react';
import { Activity, ShieldAlert, Cpu, DollarSign, Layers, CheckCircle2, RefreshCw } from 'lucide-react';
import { MetricCard } from '../types';

interface MetricCardsProps {
  cards: MetricCard[];
  theme: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  volume: Activity,
  alerts: ShieldAlert,
  precision: Cpu,
  dollar: DollarSign,
  layers: Layers,
  check: CheckCircle2,
  refresh: RefreshCw
};

export default function MetricCards({ cards, theme }: MetricCardsProps) {
  const isElectric = theme === 'electric-precision';
  const isSleek = theme === 'sleek-interface';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6" id="dashboard-metrics-grid">
      {cards.map((card, i) => {
        const IconComponent = iconMap[card.iconName] || Activity;
        return (
          <div
            key={i}
            id={`metric-card-${card.iconName}`}
            className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
              isSleek
                ? 'bg-[#151A23] border-[#1E2530] text-slate-100 hover:border-indigo-500/30 glow-accent'
                : isElectric
                ? 'bg-zinc-950 border-zinc-800 text-lime-400 hover:border-lime-400/50 shadow-[0_0_15px_rgba(132,204,22,0.05)]'
                : theme === 'sentinel-dark'
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-emerald-500/30'
                : 'bg-white border-slate-200 text-slate-900 hover:shadow-md'
            }`}
          >
            {/* Ambient subtle light for high priority values */}
            {card.iconName === 'alerts' && (
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none ${
                isSleek ? 'bg-indigo-500' : isElectric ? 'bg-red-500' : 'bg-rose-500'
              }`} />
            )}

            <div className="flex justify-between items-start">
              <div>
                <p className={`text-xs font-mono uppercase tracking-wider ${
                  isSleek ? 'text-slate-500' : isElectric ? 'text-zinc-500' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {card.label}
                </p>
                <h3 className={`text-3xl font-bold mt-2 tracking-tight ${
                  isSleek ? 'font-sans text-white' : isElectric ? 'font-mono text-lime-400' : 'font-sans'
                }`}>
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                isSleek
                  ? 'bg-[#0B0E14] border-[#1E2530] text-indigo-400'
                  : isElectric
                  ? 'bg-zinc-900 border-zinc-800 text-lime-400'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-1.5 text-xs">
              <span className={`font-semibold px-1.5 py-0.5 rounded-md ${
                card.isPositive
                  ? isSleek
                    ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/20'
                    : isElectric
                    ? 'bg-lime-950/40 text-lime-400 border border-lime-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-500 dark:text-rose-400'
              }`}>
                {card.change}
              </span>
              <span className={`opacity-60 ${isSleek ? 'text-slate-550' : isElectric ? 'text-zinc-500' : 'text-slate-500'}`}>
                from last hour
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
