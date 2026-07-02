import React, { useState } from 'react';
import { X, Shield, Brain, CheckSquare, ListFilter, AlertTriangle, HelpCircle, Loader2 } from 'lucide-react';
import { Transaction, FraudAnalysis } from '../types';

interface AiAuditModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

export default function AiAuditModal({ transaction, isOpen, onClose, theme }: AiAuditModalProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  if (!isOpen || !transaction) return null;

  const isElectric = theme === 'electric-precision';
  const isSleek = theme === 'sleek-interface';
  const isDark = theme === 'sentinel-dark' || isElectric || isSleek;

  const steps = [
    "Decrypting transaction coordinate packet...",
    "Validating device signature checksums...",
    "Querying global blacklists & IP velocity records...",
    "Consulting Gemini security auditing model..."
  ];

  const handleExecuteAudit = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setLoadingStep(0);

    // Step cycle animations
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Auditing model failed to return a response.");
      }

      const data: FraudAnalysis = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during security profiling.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs transition-opacity" id="ai-audit-backdrop">
      <div 
        id="ai-audit-drawer"
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl transition-all duration-300 transform translate-x-0 ${
          isSleek
            ? 'bg-[#0B0E14] border-l border-[#1E2530] text-slate-100'
            : isElectric 
            ? 'bg-zinc-950 border-l border-zinc-850 text-lime-400' 
            : isDark 
            ? 'bg-slate-900 border-l border-slate-800 text-slate-100' 
            : 'bg-white border-l border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex justify-between items-center ${
          isSleek ? 'border-[#1E2530]' : isElectric ? 'border-zinc-900' : 'border-slate-100 dark:border-slate-800'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg ${
              isSleek
                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 glow-accent'
                : isElectric 
                ? 'bg-lime-950/30 border border-lime-500/20 text-lime-400' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">AI Forensic Deep Audit</h3>
              <p className="text-[10px] font-mono opacity-60">ID: {transaction.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 opacity-70 hover:opacity-100"
            id="close-audit-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Transaction Spec Summary */}
          <div className={`p-4 rounded-xl border ${
            isSleek ? 'bg-[#151A23] border-[#1E2530]' : isElectric ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-slate-850'
          }`}>
            <h4 className="text-xs font-semibold uppercase tracking-wider font-mono opacity-80 mb-3">Transaction Spec Sheet</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <p className="opacity-55 text-[10px]">MERCHANT</p>
                <p className="font-semibold">{transaction.merchant}</p>
              </div>
              <div>
                <p className="opacity-55 text-[10px]">AMOUNT</p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="opacity-55 text-[10px]">COORDINATE LOC</p>
                <p className="font-semibold text-wrap">{transaction.location}</p>
              </div>
              <div>
                <p className="opacity-55 text-[10px]">HARDWARE DEVICE</p>
                <p className="font-semibold">{transaction.device}</p>
              </div>
              <div className="col-span-2">
                <p className="opacity-55 text-[10px]">RULE FLAGGED REASON</p>
                <p className="mt-1 font-medium italic opacity-90">{transaction.flaggedReason}</p>
              </div>
            </div>
          </div>

          {/* Action Trigger / State */}
          {!analysis && !loading && !error && (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                <Shield className="w-8 h-8 text-emerald-500/60" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Ready for Security Classification</h4>
                <p className="text-xs opacity-60 mt-1 max-w-sm mx-auto">
                  Execute a server-side Gemini threat analysis to inspect this transaction for multi-stage fraud patterns, velocity spikes, and network vulnerabilities.
                </p>
              </div>
              <button
                id="run-ai-audit-btn"
                onClick={handleExecuteAudit}
                className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                  isSleek
                    ? 'bg-indigo-505 bg-indigo-600 text-white hover:bg-indigo-500 glow-accent shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : isElectric
                    ? 'bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(132,204,22,0.3)]'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg'
                }`}
              >
                ⚡ EXECUTE AI FORENSIC AUDIT
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12 space-y-6" id="ai-audit-loading">
              <div className="flex justify-center">
                <Loader2 className={`w-10 h-10 animate-spin ${isSleek ? 'text-indigo-400' : isElectric ? 'text-lime-400' : 'text-emerald-500'}`} />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold font-mono tracking-wider uppercase">ANALYST ENGAGED</h4>
                <p className="text-xs opacity-75 font-mono animate-pulse min-h-[1.5rem]" id="loading-step-text">
                  {steps[loadingStep]}
                </p>
                <div className="w-48 h-1 bg-slate-100 dark:bg-zinc-900 mx-auto rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isSleek ? 'bg-indigo-500' : isElectric ? 'bg-lime-400' : 'bg-emerald-500'}`} 
                    style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error panel (Resilient key management) */}
          {error && (
            <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-3" id="ai-audit-error">
              <div className="flex items-center space-x-2 text-rose-500 text-sm font-bold">
                <AlertTriangle className="w-4.5 h-4.5" />
                <span>Forensic Engine Mismatch</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                We encountered an issue calling the Gemini auditing engine. This is usually caused by a missing API Key in your development environment.
              </p>
              <div className="p-3 bg-black/40 rounded-lg space-y-2 text-[10px] font-mono border border-zinc-800 text-zinc-300">
                <p className="font-bold text-lime-400 uppercase">🛠️ HOW TO CONFIGURE SECURELY:</p>
                <p>1. Open the **Settings &gt; Secrets** panel in the Google AI Studio UI.</p>
                <p>2. Add your **GEMINI_API_KEY** as a secure secret.</p>
                <p>3. This key will be automatically injected server-side to proxy requests.</p>
              </div>
              <button
                id="retry-audit-btn"
                onClick={handleExecuteAudit}
                className="w-full py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold rounded-lg border border-rose-500/20"
              >
                Retry Analysis
              </button>
            </div>
          )}

          {/* Success analysis report */}
          {analysis && (
            <div className="space-y-6 animate-fade-in" id="ai-audit-result">
              {/* Core summary card */}
              <div className={`p-5 rounded-xl border relative overflow-hidden ${
                isSleek ? 'bg-indigo-950/10 border-indigo-500/25 text-slate-100' : isElectric ? 'bg-lime-950/10 border-lime-500/25' : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${
                    isSleek ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-500/20' : isElectric ? 'bg-lime-950/50 text-lime-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    Threat Assessment Classification
                  </span>
                  <div className="text-right">
                    <p className="text-[9px] font-mono opacity-50">AI CONFIDENCE</p>
                    <p className={`text-base font-bold font-mono ${isSleek ? 'text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{analysis.confidence}%</p>
                  </div>
                </div>
                <h4 className={`text-sm font-bold flex items-center space-x-1.5 font-mono ${isSleek ? 'text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  <Shield className="w-4.5 h-4.5" />
                  <span>{analysis.threatVector}</span>
                </h4>
                <p className="text-xs mt-2 leading-relaxed opacity-90 font-sans">
                  {analysis.riskSummary}
                </p>
              </div>

              {/* Anomalies listed */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center space-x-1 opacity-75">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Identified Anomalies ({analysis.anomalies.length})</span>
                </h5>
                <ul className="space-y-2">
                  {analysis.anomalies.map((ano, idx) => (
                    <li 
                      key={idx}
                      className={`p-3 rounded-lg border text-xs font-mono flex items-start space-x-2 ${
                        isSleek ? 'bg-[#151A23] border-[#1E2530]' : isElectric ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 dark:bg-black/10 border-slate-100 dark:border-slate-850'
                      }`}
                    >
                      <span className="text-red-500 font-bold">●</span>
                      <span>{ano}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps / Protocol */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center space-x-1 opacity-75">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Recommended Action Protocols</span>
                </h5>
                <ol className="space-y-2">
                  {analysis.nextSteps.map((step, idx) => (
                    <li 
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                        isSleek ? 'bg-[#151A23] border-[#1E2530]' : isElectric ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 dark:bg-black/10 border-slate-100 dark:border-slate-850'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                        isSleek ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/20' : isElectric ? 'bg-lime-950/40 text-lime-400 border border-lime-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="flex-1 leading-normal opacity-90">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Run another audit */}
              <button
                id="re-run-audit-btn"
                onClick={handleExecuteAudit}
                className={`w-full py-2.5 bg-[#151A23] hover:bg-indigo-950/20 text-xs font-mono font-bold rounded-lg border ${
                  isSleek ? 'border-[#1E2530] text-indigo-400' : isElectric ? 'border-zinc-800 text-lime-400' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Re-Analyze Transaction Patterns
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-[10px] font-mono text-center opacity-50 ${
          isSleek ? 'border-[#1E2530]' : isElectric ? 'border-zinc-900' : 'border-slate-100 dark:border-slate-800'
        }`}>
          Sentinel FinTech Security Core V2.4.0-AI
        </div>
      </div>
    </div>
  );
}
