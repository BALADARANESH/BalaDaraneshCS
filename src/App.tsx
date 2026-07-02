import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Cpu, 
  History, 
  Search, 
  Filter, 
  RefreshCw, 
  FileSpreadsheet, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Brain,
  Layers,
  ChevronRight
} from 'lucide-react';

import { Transaction, MetricCard, ThemeName, SecurityInsight } from './types';
import ThemeSelector from './components/ThemeSelector';
import MetricCards from './components/MetricCards';
import ActivityMap from './components/ActivityMap';
import LiveFeed from './components/LiveFeed';
import RiskCharts from './components/RiskCharts';
import PerformanceCurves from './components/PerformanceCurves';
import AiAuditModal from './components/AiAuditModal';

export default function App() {
  // Theme Profile
  const [theme, setTheme] = useState<ThemeName>('sleek-interface');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'monitor' | 'analysis' | 'performance' | 'history'>('monitor');
  
  // Transaction & Stats state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>({
    realtimeVolume: 1284,
    volumeTrend: "+12.5%",
    activeFraudAlerts: 0,
    aiPrecision: "98.5%",
    fraudTypeDistribution: [],
    attemptsByMerchant: [],
    insights: []
  });
  
  // History query parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Audit modal target
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Loading & error handling
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dynamic transactions and dashboard stats from the server-side API
  const fetchDashboardData = async (isSilently = false) => {
    if (!isSilently) setRefreshing(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch transactions
      const txRes = await fetch('/api/transactions');
      const txData = await txRes.json();
      setTransactions(txData);
    } catch (error) {
      console.error("Error communicating with FraudGuard AI security backend:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Start periodic polling to emulate true live-streaming transaction buffers
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000); // Poll every 5 seconds to match the live backend feed rate
    return () => clearInterval(interval);
  }, []);

  // Update theme class on root body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'sentinel-light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  // Handle analyst-driven state modifications (Approved / Blocked / Investigating)
  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Blocked' | 'Investigating') => {
    try {
      const response = await fetch(`/api/transactions/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // Optimistically update frontend transaction lists & refresh backend telemetry
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        fetchDashboardData(true);
      }
    } catch (error) {
      console.error("Failed to commit security analyst action:", error);
    }
  };

  const handleOpenAudit = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsAuditOpen(true);
  };

  // Filter transaction records for the "Transaction History" table
  const filteredHistory = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.device.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || tx.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || tx.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const isElectric = theme === 'electric-precision';
  const isSleek = theme === 'sleek-interface';
  const isDark = theme === 'sentinel-dark' || isElectric || isSleek;

  // Render Metric block cards
  const metricCards: MetricCard[] = [
    {
      label: "Real-time Volume",
      value: `${stats.realtimeVolume} tx/min`,
      change: stats.volumeTrend || "+12.5%",
      isPositive: true,
      iconName: "volume"
    },
    {
      label: "Active Fraud Alerts",
      value: `${stats.activeFraudAlerts} Priority`,
      change: `-${stats.activeFraudAlerts > 0 ? '5.2' : '10.0'}%`,
      isPositive: stats.activeFraudAlerts <= 3,
      iconName: "alerts"
    },
    {
      label: "AI Precision Score",
      value: stats.aiPrecision || "98.5%",
      change: "+0.2%",
      isPositive: true,
      iconName: "precision"
    }
  ];

  return (
    <div 
      id="app-root-container"
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isSleek
          ? 'bg-[#0B0E14] text-[#E2E8F0] selection:bg-indigo-500 selection:text-white'
          : isElectric 
          ? 'bg-black text-zinc-300 selection:bg-lime-400 selection:text-black' 
          : theme === 'sentinel-dark'
          ? 'bg-slate-950 text-slate-300 selection:bg-emerald-500 selection:text-white'
          : 'bg-slate-50/50 text-slate-700 selection:bg-emerald-600 selection:text-white'
      }`}
    >
      {/* GLOBAL HIGH-TECH TOP NAVBAR */}
      <header 
        id="app-main-header"
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isSleek
            ? 'bg-[#0B0E14]/90 border-[#1E2530] sleek-glass'
            : isElectric 
            ? 'bg-black/90 border-zinc-900' 
            : theme === 'sentinel-dark'
            ? 'bg-slate-950/90 border-slate-900'
            : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
              isSleek
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 glow-accent'
                : isElectric 
                ? 'bg-zinc-900/40 border-lime-400/20 text-lime-400 shadow-[0_0_12px_rgba(132,204,22,0.15)]' 
                : 'bg-emerald-600 border-transparent text-white'
            }`}>
              <ShieldAlert className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-base font-black tracking-tight ${
                  isSleek ? 'text-white' : isElectric ? 'font-mono text-lime-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {isSleek ? 'Sentinel AI' : isElectric ? '⚡ SENTINEL FINTECH' : theme === 'sentinel-light' ? 'Sentinel FinTech' : 'Sentinel FinTech Dark'}
                </span>
                <span className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  isSleek ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/20' : isElectric ? 'bg-lime-950/60 text-lime-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}>
                  PRO ACTIVE AI
                </span>
              </div>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block">Financial Transaction Security Core</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSelector currentTheme={theme} onChangeTheme={setTheme} />
            <button
              id="global-refresh-btn"
              onClick={() => fetchDashboardData()}
              className={`p-2 rounded-lg border transition-all ${
                isSleek
                  ? 'bg-[#151A23] border-[#1E2530] text-indigo-400 hover:border-indigo-500 hover:bg-indigo-950/20'
                  : isElectric 
                  ? 'bg-zinc-900 border-zinc-850 text-lime-400 hover:border-lime-400' 
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              title="Force Sync System Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* PRIMARY CONTEXT CONTROL / TAB BAR */}
      <div 
        id="navigation-tab-container"
        className={`border-b transition-colors ${
          isSleek
            ? 'bg-[#0D1117] border-[#1E2530]'
            : isElectric
            ? 'bg-zinc-950 border-zinc-900'
            : theme === 'sentinel-dark'
            ? 'bg-slate-900/60 border-slate-900'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto whitespace-nowrap">
          <nav className="flex space-x-6 py-3" id="main-navigation-tabs">
            {[
              { id: 'monitor', name: 'Real-time Monitor', icon: Activity },
              { id: 'analysis', name: 'Risk Analysis Engine', icon: Layers },
              { id: 'performance', name: 'Model Performance', icon: Cpu },
              { id: 'history', name: 'Transaction History', icon: History }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-1.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? isSleek
                        ? 'border-indigo-500 text-indigo-400 font-bold'
                        : isElectric
                        ? 'border-lime-400 text-lime-400 font-bold'
                        : 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden md:block">
            Secure Node: US-CHI-S1
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT CANVAS VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-dashboard-viewport">
        {loading ? (
          <div className="text-center py-24 space-y-4" id="global-spinner-state">
            <RefreshCw className={`w-10 h-10 animate-spin mx-auto ${isElectric ? 'text-lime-400' : 'text-emerald-500'}`} />
            <p className="text-xs font-mono tracking-wider opacity-60">Synchronizing secure card channels...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Real-time stats are sticky across views for top-tier visual flow */}
            <MetricCards cards={metricCards} theme={theme} />

            {/* TAB VIEW: 1. Real-time Monitor */}
            {activeTab === 'monitor' && (
              <div className="space-y-6 animate-fade-in" id="monitor-tab-view">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left column - Global Map Placeholder */}
                  <div className="lg:col-span-12">
                    <ActivityMap latestTransactions={transactions} theme={theme} />
                  </div>
                </div>
                {/* Live Queue Table & Insights Panel */}
                <LiveFeed 
                  transactions={transactions} 
                  insights={stats.insights} 
                  onSelectTransaction={handleOpenAudit}
                  onUpdateStatus={handleUpdateStatus}
                  theme={theme}
                />
              </div>
            )}

            {/* TAB VIEW: 2. Risk Analysis Engine */}
            {activeTab === 'analysis' && (
              <div className="space-y-6 animate-fade-in" id="analysis-tab-view">
                <RiskCharts 
                  distribution={stats.fraudTypeDistribution} 
                  attempts={stats.attemptsByMerchant} 
                  theme={theme} 
                />

                {/* AI Risk Matrix List */}
                <div className={`p-5 rounded-xl border transition-all duration-300 ${
                  isSleek ? 'bg-[#151A23] border-[#1E2530] text-slate-100' : isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-sm font-semibold tracking-tight uppercase font-mono">AI Risk Scoring Matrix</h4>
                      <p className="text-[10px] opacity-55 mt-0.5">Automated classification parameters for behavioral anomalies</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto text-xs font-mono">
                    <table className="w-full text-left border-collapse" id="scoring-matrix-table">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-800 opacity-50 uppercase tracking-wider text-[10px] pb-2">
                          <th className="pb-3">Threat Dimension</th>
                          <th className="pb-3">Confidence Floor</th>
                          <th className="pb-3">Weighted Multiplier</th>
                          <th className="pb-3">Default Protocol Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/60 opacity-90">
                        {[
                          { dim: "High-Speed Geo Velocity", floor: "94.2%", multiplier: "1.45x", action: "Block Card immediately" },
                          { dim: "New Hardware ID in luxury node", floor: "88.1%", multiplier: "1.20x", action: "Hold for review" },
                          { dim: "Card Not Present sub-dollar charge", floor: "78.4%", multiplier: "1.05x", action: "Analyst Audit queue" },
                          { dim: "Mismatched Billing / Delivery Country", floor: "82.9%", multiplier: "1.15x", action: "Flag for investigation" }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20">
                            <td className="py-3 font-semibold">{row.dim}</td>
                            <td className="py-3">{row.floor}</td>
                            <td className="py-3 text-red-500">{row.multiplier}</td>
                            <td className="py-3 text-emerald-600 dark:text-emerald-400">{row.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW: 3. Model Performance */}
            {activeTab === 'performance' && (
              <div className="space-y-6 animate-fade-in" id="performance-tab-view">
                <PerformanceCurves theme={theme} />
                
                {/* Lifecyle overview */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-xl border ${
                  isSleek ? 'bg-[#151A23] border-[#1E2530] text-slate-200' : isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`} id="lifecycle-panel">
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-wider opacity-50">Model Lifecycle Status</h5>
                    <p className="text-sm font-semibold mt-1">Version: Sentinel-ML v2.4.0-Ensemble</p>
                    <p className="text-xs opacity-60 mt-1">Last retrained: Oct 24, 2023 (Auto-scheduled daily sync)</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-wider opacity-50">Feature Drift Impact</h5>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-xs font-semibold text-emerald-500">LOW DRIFT IMPACT (0.012)</span>
                    </div>
                    <p className="text-xs opacity-60 mt-1">High conformity with expected transaction distribution curves</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-mono uppercase tracking-wider opacity-50">Training Coverage</h5>
                    <p className="text-sm font-semibold mt-1">92% Coverage of global card categories</p>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-900 mt-2 rounded-full overflow-hidden">
                      <div className={`h-full ${isSleek ? 'bg-indigo-500' : isElectric ? 'bg-lime-400' : 'bg-emerald-500'}`} style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW: 4. Transaction History */}
            {activeTab === 'history' && (
              <div className="space-y-6 animate-fade-in" id="history-tab-view">
                {/* Query filters container */}
                <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
                  isSleek ? 'bg-[#151A23] border-[#1E2530]' : isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex flex-1 min-w-[260px] relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 opacity-40" />
                    <input
                      type="text"
                      placeholder="Filter transaction ID, merchant, coords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-2.5 pl-10 pr-4 rounded-lg text-xs font-mono border focus:outline-none focus:ring-1 ${
                        isSleek
                          ? 'bg-[#0B0E14] border-[#1E2530] focus:border-indigo-500 focus:ring-indigo-500 text-slate-200'
                          : isElectric 
                          ? 'bg-zinc-900 border-zinc-800 focus:border-lime-400 focus:ring-lime-400 text-lime-400' 
                          : isDark 
                          ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500 text-white' 
                          : 'bg-white border-slate-200 focus:border-emerald-600 focus:ring-emerald-600'
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-3.5 h-3.5 opacity-55" />
                      <span className="opacity-60 hidden sm:inline">Risk:</span>
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className={`p-2 rounded-lg border text-xs focus:outline-none ${
                          isSleek ? 'bg-[#0B0E14] border-[#1E2530] text-slate-200' : isElectric ? 'bg-zinc-900 border-zinc-800 text-lime-400' : isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="critical">Critical Only</option>
                        <option value="high">High Only</option>
                        <option value="caution">Caution Only</option>
                        <option value="safe">Safe Only</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="opacity-60 hidden sm:inline">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`p-2 rounded-lg border text-xs focus:outline-none ${
                          isSleek ? 'bg-[#0B0E14] border-[#1E2530] text-slate-200' : isElectric ? 'bg-zinc-900 border-zinc-800 text-lime-400' : isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="all">All Statuses</option>
                        <option value="flagged">Flagged</option>
                        <option value="approved">Approved</option>
                        <option value="blocked">Blocked</option>
                        <option value="investigating">Investigating</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Primary Spreadsheet Grid of Transactions */}
                <div className={`p-5 rounded-xl border transition-all duration-300 ${
                  isSleek ? 'bg-[#151A23] border-[#1E2530]' : isElectric ? 'bg-zinc-950 border-zinc-800' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`} id="history-spreadsheet-container">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold flex items-center space-x-1.5 font-mono">
                      <FileSpreadsheet className="w-4.5 h-4.5" />
                      <span>Ledger Records ({filteredHistory.length})</span>
                    </h4>
                    <span className="text-[10px] font-mono opacity-55">TOTAL VOLUME DETECTED: $1.24M</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="history-spreadsheet-table">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-mono opacity-50 uppercase tracking-wider">
                          <th className="pb-3">Transaction ID</th>
                          <th className="pb-3">Merchant</th>
                          <th className="pb-3">Risk Assessment</th>
                          <th className="pb-3">Hardware ID</th>
                          <th className="pb-3">Location Coords</th>
                          <th className="pb-3">Settlement</th>
                          <th className="pb-3 text-right">Analyst Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-900/60 text-xs">
                        {filteredHistory.map((tx) => (
                          <tr 
                            key={tx.id} 
                            id={`history-row-${tx.id}`}
                            className={`transition-colors cursor-pointer group ${isSleek ? 'hover:bg-indigo-950/25' : 'hover:bg-slate-50 dark:hover:bg-zinc-950/40'}`}
                            onClick={() => handleOpenAudit(tx)}
                          >
                            <td className="py-3.5 font-mono">
                              <p className={`font-bold transition-colors ${isSleek ? 'group-hover:text-indigo-400' : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400'}`}>#{tx.id}</p>
                              <p className="text-[9px] opacity-55 mt-0.5">{new Date(tx.timestamp).toLocaleString()}</p>
                            </td>
                            <td className="py-3.5">
                              <p className="font-semibold">{tx.merchant}</p>
                              <p className="text-[10px] opacity-65 mt-0.5 font-mono">{tx.category}</p>
                            </td>
                            <td className="py-3.5">
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                                tx.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                tx.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                tx.riskLevel === 'Caution' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                {tx.riskLevel} ({tx.riskScore})
                              </span>
                            </td>
                            <td className="py-3.5 font-mono opacity-80">{tx.device}</td>
                            <td className="py-3.5 font-mono opacity-80">{tx.location}</td>
                            <td className="py-3.5 font-mono font-bold">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end space-x-1.5">
                                {tx.status === 'Flagged' ? (
                                  <>
                                    <button
                                      id={`action-clear-${tx.id}`}
                                      onClick={() => handleUpdateStatus(tx.id, 'Approved')}
                                      className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
                                      title="Clear Transaction"
                                    >
                                      <CheckCircle2 className="w-4.5 h-4.5" />
                                    </button>
                                    <button
                                      id={`action-block-${tx.id}`}
                                      onClick={() => handleUpdateStatus(tx.id, 'Blocked')}
                                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                                      title="Block Card/Transaction"
                                    >
                                      <XCircle className="w-4.5 h-4.5" />
                                    </button>
                                  </>
                                ) : tx.status === 'Blocked' ? (
                                  <span className="text-red-500 font-mono font-bold text-[10px]">BLOCKED</span>
                                ) : tx.status === 'Approved' ? (
                                  <span className="text-emerald-500 font-mono font-bold text-[10px]">CLEARED</span>
                                ) : (
                                  <span className="text-amber-500 font-mono font-bold text-[10px]">REVIEWING</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER METRICS */}
      <footer className={`border-t py-6 text-center text-xs font-mono opacity-65 mt-16 transition-colors ${
        isSleek ? 'border-[#1E2530] bg-[#0B0E14]' : isElectric ? 'border-zinc-900 bg-black' : theme === 'sentinel-dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
      }`} id="dashboard-footer">
        <p>© {new Date().getFullYear()} Sentinel AI systems corporation. Advanced Threat Matrix active.</p>
      </footer>

      {/* SLIDEOUT DRAWER FOR GEMINI FORENSIC ANALYSIS */}
      <AiAuditModal 
        transaction={selectedTx}
        isOpen={isAuditOpen}
        onClose={() => {
          setSelectedTx(null);
          setIsAuditOpen(false);
        }}
        theme={theme}
      />
    </div>
  );
}
