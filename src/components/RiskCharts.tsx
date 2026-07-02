import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RiskChartsProps {
  distribution: { name: string; value: number }[];
  attempts: { name: string; value: number }[];
  theme: string;
}

export default function RiskCharts({ distribution, attempts, theme }: RiskChartsProps) {
  const isElectric = theme === 'electric-precision';
  const isDark = theme === 'sentinel-dark' || isElectric;

  // Custom colors based on current dashboard themes
  const COLORS = isElectric 
    ? ['#84cc16', '#a3e635', '#4d7c0f'] 
    : isDark 
    ? ['#059669', '#10b981', '#6ee7b7'] 
    : ['#0f766e', '#14b8a6', '#99f6e4'];

  const barColor = isElectric ? '#84cc16' : isDark ? '#10b981' : '#0d9488';

  const tooltipContentStyle = {
    backgroundColor: isDark ? '#000000' : '#ffffff',
    borderColor: isElectric ? '#84cc16' : isDark ? '#1f2937' : '#e2e8f0',
    borderRadius: '8px',
    color: isDark ? '#f3f4f6' : '#0f172a',
    fontFamily: 'monospace',
    fontSize: '12px'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" id="risk-analysis-charts-grid">
      {/* Donut Chart: Fraud Type Distribution */}
      <div
        className={`p-5 rounded-xl border transition-all duration-300 ${
          isElectric
            ? 'bg-zinc-950 border-zinc-800'
            : isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
        id="donut-chart-card"
      >
        <h4 className={`text-sm font-semibold mb-4 tracking-tight uppercase font-mono ${
          isElectric ? 'text-lime-400' : isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          Fraud Type Distribution
        </h4>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipContentStyle} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Attempts by Merchant Category */}
      <div
        className={`p-5 rounded-xl border transition-all duration-300 ${
          isElectric
            ? 'bg-zinc-950 border-zinc-800'
            : isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
        id="bar-chart-card"
      >
        <h4 className={`text-sm font-semibold mb-4 tracking-tight uppercase font-mono ${
          isElectric ? 'text-lime-400' : isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          Attempts by Merchant Category
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={attempts}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isElectric ? 'rgba(132, 204, 22, 0.05)' : isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0,0,0,0.03)'} 
              />
              <XAxis 
                dataKey="name" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }} />
              <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]}>
                {attempts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || barColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
