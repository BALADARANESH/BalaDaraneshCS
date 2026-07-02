import React, { useState } from 'react';
import { ShieldAlert, ShieldX, Clock, ChevronRight, Check, AlertCircle, ShieldCheck, Search, ShieldAlert as AlertIcon } from 'lucide-react';
import { Transaction, SecurityInsight } from '../types';

interface LiveFeedProps {
  transactions: Transaction[];
  insights: SecurityInsight[];
  onSelectTransaction: (tx: Transaction) => void;
  onUpdateStatus: (id: string, status: 'Approved' | 'Blocked' | 'Investigating') => Promise<void>;
  theme: string;
}

export default function LiveFeed({ 
  transactions, 
  insights, 
  onSelectTransaction, 
  onUpdateStatus, 
  theme 
}: LiveFeedProps) {
  const [actingId, setActingId] = useState<string | null>(null);
  const isElectric = theme === 'electric-precision';
  const isSleek = theme === 'sleek-interface';
  const isDark = theme === 'sentinel-dark' || isElectric || isSleek;

  // Grab the highest risk 'Flagged' transaction to showcase in the primary focus block
  const focusTx = transactions.find(t => t.status === 'Flagged') || transactions.find(t => t.riskLevel === 'Critical') || transactions[0];

  const handleAction = async (id: string, status: 'Approved' | 'Blocked' | 'Investigating') => {
    setActingId(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setActingId(null);
    }
  };

  const getRiskLevelStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Caution':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="real-time-monitor-grid">
      
      {/* LEFT & CENTER PANEL (8 columns on large desktop): High Risk Focus + Live Queue */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Focus High-Risk Action Block */}
        {focusTx && (
          <div 
            id="high-risk-focus-card"
            className={`p-6 rounded-xl border relative overflow-hidden transition-all duration-300 ${
              isSleek
                ? 'bg-[#151A23] border-indigo-500/30 text-slate-100 shadow-[0_0_20px_rgba(99,102,241,0.06)] glow-accent'
                : isElectric
                ? 'bg-zinc-950 border-red-500/30 text-lime-400 shadow-[0_0_20px_rgba(239,68,68,0.06)]'
                : theme === 'sentinel-dark'
                ? 'bg-slate-900 border-rose-950 text-slate-100 shadow-[0_4px_25px_rgba(244,63,94,0.04)]'
                : 'bg-rose-50/45 border-rose-100 text-slate-900'
            }`}
          >
            {/* Pulsing high danger alert badge */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg animate-pulse border border-red-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Threat Alert Level 1 (Critical)</h4>
                  <p className="text-sm font-semibold mt-0.5">High Risk Transaction ID: #{focusTx.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${getRiskLevelStyle(focusTx.riskLevel)}`}>
                  RISK SCORE: {focusTx.riskScore}/100
                </span>
                <span className="text-[10px] font-mono opacity-55 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(focusTx.timestamp).toLocaleTimeString()}</span>
                </span>
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b mb-4 text-xs font-mono ${isSleek ? 'border-indigo-500/15' : 'border-rose-500/10'}`}>
              <div>
                <p className="opacity-50 text-[10px] uppercase">MERCHANT TERMINAL</p>
                <p className="font-bold mt-0.5">{focusTx.merchant}</p>
              </div>
              <div>
                <p className="opacity-50 text-[10px] uppercase">VELOCITY SUM / AMOUNT</p>
                <p className="font-bold mt-0.5 text-base text-red-600 dark:text-red-400">
                  ${focusTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="opacity-50 text-[10px] uppercase">CLIENT DEVICE / COORDINATES</p>
                <p className="font-bold mt-0.5 truncate" title={focusTx.device}>{focusTx.device}</p>
              </div>
              <div className="md:col-span-3">
                <p className="opacity-50 text-[10px] uppercase">AI DETECTED THREAT VECTORS</p>
                <p className="font-semibold text-rose-600 dark:text-rose-300 mt-1 italic leading-relaxed">
                  {focusTx.flaggedReason}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                id="focus-card-audit-btn"
                onClick={() => onSelectTransaction(focusTx)}
                className={`py-2 px-4 rounded-lg text-xs font-mono font-bold transition-all ${
                  isSleek
                    ? 'bg-[#0B0E14] hover:bg-indigo-950/20 text-indigo-400 border border-indigo-500/20'
                    : isElectric
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-lime-400 border border-zinc-800'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                🔎 RUN AI DEEP AUDIT
              </button>

              <div className="flex items-center space-x-3">
                {actingId === focusTx.id ? (
                  <span className="text-xs font-mono opacity-60">Encrypting actions...</span>
                ) : (
                  <>
                    <button
                      id="focus-card-investigate-btn"
                      onClick={() => handleAction(focusTx.id, 'Investigating')}
                      className="py-2 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold rounded-lg border border-amber-500/20"
                    >
                      INVESTIGATE
                    </button>
                    <button
                      id="focus-card-block-btn"
                      onClick={() => handleAction(focusTx.id, 'Blocked')}
                      className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold rounded-lg shadow-md"
                    >
                      ❌ BLOCK CARD
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Transaction Queue Section */}
        <div 
          className={`p-5 rounded-xl border transition-all duration-300 ${
            isSleek ? 'bg-[#151A23] border-[#1E2530] text-slate-200' : isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
          id="live-feed-table-card"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-semibold tracking-tight">Live Risk Monitor Feed</h4>
              <p className="text-[10px] font-mono opacity-50 mt-0.5">Streaming real-time global card network events</p>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isSleek ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/20' : isElectric ? 'bg-lime-950/40 text-lime-400' : 'bg-emerald-500/10 text-emerald-600'
            }`}>
              REAL-TIME BUFFER ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="live-monitor-queue-table">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-mono opacity-50 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID / Timestamp</th>
                  <th className="pb-3 font-semibold">Merchant / Category</th>
                  <th className="pb-3 font-semibold">Risk Rating</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-right">Sec Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/60 text-xs">
                {transactions.slice(0, 10).map((tx) => (
                  <tr 
                    key={tx.id} 
                    id={`live-tx-row-${tx.id}`}
                    className={`transition-colors group cursor-pointer ${isSleek ? 'hover:bg-indigo-950/25 border-b border-[#1E2530]/50' : 'hover:bg-slate-50 dark:hover:bg-zinc-950/40'}`}
                    onClick={() => onSelectTransaction(tx)}
                  >
                    <td className="py-3.5 font-mono">
                      <p className={`font-bold transition-colors ${isSleek ? 'group-hover:text-indigo-400' : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'}`}>#{tx.id}</p>
                      <p className="text-[9px] opacity-55 mt-0.5">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                    </td>
                    <td className="py-3.5">
                      <p className="font-medium truncate max-w-[160px]" title={tx.merchant}>{tx.merchant}</p>
                      <p className="text-[10px] opacity-60 font-mono mt-0.5">{tx.category}</p>
                    </td>
                    <td className="py-3.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${getRiskLevelStyle(tx.riskLevel)}`}>
                        {tx.riskLevel} ({tx.riskScore})
                      </span>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                      ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 text-right font-mono text-[10px]" onClick={(e) => e.stopPropagation()}>
                      {tx.status === 'Flagged' ? (
                        <button
                          id={`audit-row-btn-${tx.id}`}
                          onClick={() => onSelectTransaction(tx)}
                          className={`px-2 py-1 text-[9px] font-bold rounded-md ${
                            isSleek
                              ? 'bg-[#0B0E14] text-indigo-400 border border-indigo-500/20'
                              : isElectric 
                              ? 'bg-lime-950/30 text-lime-400 border border-lime-500/20' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          AUDIT AI
                        </button>
                      ) : tx.status === 'Blocked' ? (
                        <span className="text-red-500 font-bold uppercase tracking-wider text-[9px] flex items-center justify-end space-x-1">
                          <ShieldX className="w-3 h-3 inline" />
                          <span>BLOCKED</span>
                        </span>
                      ) : tx.status === 'Approved' ? (
                        <span className="text-emerald-500 font-bold uppercase tracking-wider text-[9px] flex items-center justify-end space-x-1">
                          <ShieldCheck className="w-3 h-3 inline" />
                          <span>CLEARED</span>
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold uppercase tracking-wider text-[9px] flex items-center justify-end space-x-1">
                          <Clock className="w-3 h-3 inline" />
                          <span>REVIEWING</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (4 columns on desktop): Real-time AI Intelligence stream */}
      <div className="xl:col-span-4 space-y-6">
        
        <div 
          className={`p-5 rounded-xl border h-full flex flex-col transition-all duration-300 ${
            isSleek ? 'bg-[#151A23] border-[#1E2530] text-slate-200' : isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
          id="real-time-intelligence-panel"
        >
          <div className="flex items-center space-x-2.5 mb-5 border-b border-slate-100 dark:border-zinc-900 pb-3">
            <div className={`p-1.5 rounded-lg ${
              isSleek ? 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-400' : isElectric ? 'bg-lime-950/30 border border-lime-500/20 text-lime-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              <AlertIcon className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Security Intelligence</h4>
              <p className="text-[10px] font-mono opacity-50">Live machine learning rule updates</p>
            </div>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
            {insights.map((ins) => (
              <div 
                key={ins.id}
                id={`insight-${ins.id}`}
                className={`p-3.5 rounded-xl border text-xs font-mono transition-all ${
                  ins.type === 'alert'
                    ? 'bg-rose-500/5 border-rose-500/15 text-rose-600 dark:text-rose-400'
                    : ins.type === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/15 text-amber-600 dark:text-amber-400'
                    : isSleek
                    ? 'bg-[#0B0E14] border-[#1E2530]/50 text-slate-400'
                    : isElectric
                    ? 'bg-zinc-900/50 border-zinc-850 text-zinc-400'
                    : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                    ins.type === 'alert' 
                      ? 'bg-red-500/10' 
                      : ins.type === 'warning' 
                      ? 'bg-amber-500/10' 
                      : 'bg-slate-500/10'
                  }`}>
                    {ins.type}
                  </span>
                  <span className="text-[8px] opacity-55">
                    {new Date(ins.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="leading-relaxed text-wrap">{ins.message}</p>
              </div>
            ))}
          </div>

          <div className={`mt-5 border-t pt-3.5 text-center text-[10px] font-mono opacity-50 ${
            isElectric ? 'border-zinc-900' : 'border-slate-105 dark:border-zinc-900'
          }`}>
            Streaming secured via transport layer TLS 1.3
          </div>
        </div>
      </div>
    </div>
  );
}
