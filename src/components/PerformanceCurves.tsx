import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PerformanceCurvesProps {
  theme: string;
}

export default function PerformanceCurves({ theme }: PerformanceCurvesProps) {
  const isElectric = theme === 'electric-precision';
  const isDark = theme === 'sentinel-dark' || isElectric;

  // Real ROC and Precision-Recall coordinate curves
  const rocData = [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.02, tpr: 0.85 },
    { fpr: 0.05, tpr: 0.94 },
    { fpr: 0.10, tpr: 0.98 },
    { fpr: 0.20, tpr: 0.99 },
    { fpr: 0.50, tpr: 1.00 },
    { fpr: 1.00, tpr: 1.00 }
  ];

  const prData = [
    { recall: 0.00, precision: 1.00 },
    { recall: 0.20, precision: 0.99 },
    { recall: 0.40, precision: 0.98 },
    { recall: 0.60, precision: 0.97 },
    { recall: 0.80, precision: 0.95 },
    { recall: 0.90, precision: 0.91 },
    { recall: 0.95, precision: 0.82 },
    { recall: 1.00, precision: 0.05 }
  ];

  const curveColor = isElectric ? '#84cc16' : isDark ? '#10b981' : '#0d9488';
  const baseLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div className="space-y-6" id="performance-curves-root">
      {/* 2x2 Grid of Model Health Metrics & Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Detection Curves Card */}
        <div className={`p-5 rounded-xl border transition-all duration-300 ${
          isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-sm font-semibold mb-4 tracking-tight uppercase font-mono">ROC Curve (True Positive vs False Positive)</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={baseLineColor} />
                <XAxis dataKey="fpr" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip />
                <Line type="monotone" dataKey="tpr" stroke={curveColor} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} name="True Positive Rate" />
                <Line type="linear" dataKey="fpr" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="5 5" name="Random Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Precision-Recall Curve */}
        <div className={`p-5 rounded-xl border transition-all duration-300 ${
          isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-sm font-semibold mb-4 tracking-tight uppercase font-mono">Precision-Recall Curve (Confidence Fit)</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={baseLineColor} />
                <XAxis dataKey="recall" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip />
                <Line type="monotone" dataKey="precision" stroke={curveColor} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} name="Precision" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & Ensemble Architecture Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Confusion Matrix Table */}
        <div className={`lg:col-span-5 p-5 rounded-xl border transition-all duration-300 ${
          isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-sm font-semibold mb-4 tracking-tight uppercase font-mono">Confusion Matrix (Actual vs Predicted)</h4>
          
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
            {/* Corner header */}
            <div className="p-2"></div>
            <div className="p-2 border-b border-slate-100 dark:border-zinc-800 font-bold opacity-80">PREDICTED (+)</div>
            <div className="p-2 border-b border-slate-100 dark:border-zinc-800 font-bold opacity-80">PREDICTED (-)</div>

            {/* Row Actual Positive */}
            <div className="p-3 font-bold border-r border-slate-100 dark:border-zinc-800 flex items-center justify-center opacity-80">ACTUAL (+)</div>
            <div className={`p-4 rounded-lg flex flex-col justify-center items-center ${isElectric ? 'bg-lime-950/20 text-lime-400 border border-lime-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
              <span className="text-sm font-bold">12,482</span>
              <span className="text-[9px] opacity-65 mt-1">TRUE POS (TP)</span>
            </div>
            <div className="p-4 rounded-lg bg-red-500/5 text-red-600 dark:text-red-400 border border-transparent flex flex-col justify-center items-center">
              <span className="text-sm font-bold">12</span>
              <span className="text-[9px] opacity-65 mt-1">FALSE NEG (FN)</span>
            </div>

            {/* Row Actual Negative */}
            <div className="p-3 font-bold border-r border-slate-100 dark:border-zinc-800 flex items-center justify-center opacity-80">ACTUAL (-)</div>
            <div className="p-4 rounded-lg bg-orange-500/5 text-orange-600 dark:text-orange-400 border border-transparent flex flex-col justify-center items-center">
              <span className="text-sm font-bold">15</span>
              <span className="text-[9px] opacity-65 mt-1">FALSE POS (FP)</span>
            </div>
            <div className={`p-4 rounded-lg flex flex-col justify-center items-center ${isElectric ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-slate-50 dark:bg-black/30 border border-transparent text-slate-500'}`}>
              <span className="text-sm font-bold">132,492</span>
              <span className="text-[9px] opacity-65 mt-1">TRUE NEG (TN)</span>
            </div>
          </div>
          <p className="text-[10px] font-mono opacity-60 mt-3 text-center">FPR: 0.12% | Precision Rate: 99.88%</p>
        </div>

        {/* Ensemble Architecture Neural Net layout */}
        <div className={`lg:col-span-7 p-5 rounded-xl border transition-all duration-300 ${
          isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-sm font-semibold mb-4 tracking-tight uppercase font-mono">Architecture Ensemble Diagram</h4>

          <div className="flex flex-col md:flex-row justify-between items-center h-40 px-4 relative">
            {/* Input Feature layer */}
            <div className="flex flex-col space-y-1 z-10">
              <div className="px-2 py-1 bg-slate-100 dark:bg-zinc-900 rounded text-[9px] font-mono border border-slate-200 dark:border-zinc-800">14x Raw Tx Feats</div>
              <div className="px-2 py-1 bg-slate-100 dark:bg-zinc-900 rounded text-[9px] font-mono border border-slate-200 dark:border-zinc-800">4x Geo IP Velocity</div>
              <div className="px-2 py-1 bg-slate-100 dark:bg-zinc-900 rounded text-[9px] font-mono border border-slate-200 dark:border-zinc-800">Device Fingerprint</div>
            </div>

            {/* Connecting visual lines */}
            <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none hidden md:flex">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="20%" y1="20%" x2="50%" y2="30%" stroke={curveColor} strokeWidth="1.5" />
                <line x1="20%" y1="50%" x2="50%" y2="30%" stroke={curveColor} strokeWidth="1.5" />
                <line x1="20%" y1="80%" x2="50%" y2="70%" stroke={curveColor} strokeWidth="1.5" />
                
                <line x1="20%" y1="50%" x2="50%" y2="70%" stroke={curveColor} strokeWidth="1.5" />
                <line x1="50%" y1="30%" x2="80%" y2="50%" stroke={curveColor} strokeWidth="1.5" />
                <line x1="50%" y1="70%" x2="80%" y2="50%" stroke={curveColor} strokeWidth="1.5" />
              </svg>
            </div>

            {/* Model Nodes */}
            <div className="flex flex-col space-y-4 md:space-y-6 z-10 my-2 md:my-0">
              <div className={`p-2.5 rounded-lg border text-center ${isElectric ? 'bg-zinc-900 border-zinc-800 text-lime-400' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'}`}>
                <p className="text-[10px] font-bold font-mono">XGBoost Classifier</p>
                <span className="text-[8px] opacity-70">Decision Weight: 40%</span>
              </div>
              <div className={`p-2.5 rounded-lg border text-center ${isElectric ? 'bg-zinc-900 border-zinc-800 text-lime-400' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'}`}>
                <p className="text-[10px] font-bold font-mono">Deep Neural Net (DNN)</p>
                <span className="text-[8px] opacity-70">Weights Overlaid: 60%</span>
              </div>
            </div>

            {/* Unified Output score */}
            <div className="z-10">
              <div className={`p-3 rounded-full border text-center w-24 h-24 flex flex-col justify-center items-center ${
                isElectric 
                  ? 'bg-lime-950/20 border-lime-400 text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.15)]' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}>
                <span className="text-xs font-bold font-mono">ENSEMBLE</span>
                <span className="text-sm font-black mt-0.5">98.5%</span>
                <span className="text-[7px] opacity-70 mt-0.5">PRECISION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
