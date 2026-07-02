import React, { useEffect, useRef, useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { Transaction } from '../types';

interface ActivityMapProps {
  latestTransactions: Transaction[];
  theme: string;
}

interface MapNode {
  x: number;
  y: number;
  label: string;
  pulse: number;
  color: string;
}

export default function ActivityMap({ latestTransactions, theme }: ActivityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const nodesRef = useRef<MapNode[]>([]);

  // Monitor element sizing responsively
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 200),
          height: Math.max(height || 260, 260)
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update canvas nodes whenever a high-risk or new transaction lands
  useEffect(() => {
    if (latestTransactions.length === 0) return;
    
    // Convert location labels to coordinates
    const locationsList = [
      { name: "Zurich", x: 0.48, y: 0.35, color: "#f43f5e" },
      { name: "Lagos", x: 0.50, y: 0.65, color: "#f59e0b" },
      { name: "Chicago", x: 0.25, y: 0.38, color: "#10b981" },
      { name: "Tokyo", x: 0.82, y: 0.42, color: "#3b82f6" },
      { name: "Reykjavik", x: 0.42, y: 0.22, color: "#ec4899" },
      { name: "Dublin", x: 0.45, y: 0.32, color: "#10b981" },
      { name: "Los Angeles", x: 0.18, y: 0.45, color: "#ef4444" },
      { name: "London", x: 0.46, y: 0.31, color: "#3b82f6" },
      { name: "Sydney", x: 0.88, y: 0.82, color: "#10b981" },
      { name: "Berlin", x: 0.49, y: 0.33, color: "#3b82f6" }
    ];

    const currentTx = latestTransactions[0];
    const locMatch = locationsList.find(l => 
      currentTx.location.toLowerCase().includes(l.name.toLowerCase())
    ) || locationsList[Math.floor(Math.random() * locationsList.length)];

    const txColor = 
      currentTx.riskLevel === 'Critical' ? '#ef4444' : 
      currentTx.riskLevel === 'High' ? '#f97316' : 
      currentTx.riskLevel === 'Caution' ? '#eab308' : '#10b981';

    // Add node
    const newNode: MapNode = {
      x: locMatch.x,
      y: locMatch.y,
      label: currentTx.merchant.slice(0, 16) + ` ($${currentTx.amount})`,
      pulse: 1.0,
      color: txColor
    };

    // Replace or push
    nodesRef.current = [newNode, ...nodesRef.current.slice(0, 5)];
  }, [latestTransactions]);

  // Main canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isElectric = theme === 'electric-precision';
    const isDark = theme === 'sentinel-dark' || isElectric;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw background grid lines matching high-tech financial dashboard
      ctx.strokeStyle = isElectric 
        ? 'rgba(132, 204, 22, 0.04)' 
        : isDark 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(0, 0, 0, 0.03)';
      ctx.lineWidth = 1;

      const gridSize = 30;
      for (let x = 0; x < dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      for (let y = 0; y < dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Draw abstract safe zone outline rings (concentric radar tracking)
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      ctx.strokeStyle = isElectric 
        ? 'rgba(132, 204, 22, 0.06)' 
        : isDark 
        ? 'rgba(16, 185, 129, 0.04)' 
        : 'rgba(0, 0, 0, 0.02)';
      
      for (let r = 80; r < Math.min(dimensions.width, dimensions.height); r += 80) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw abstract world nodes (locations)
      const staticLocs = [
        { name: "NA Sector", x: 0.22, y: 0.40 },
        { name: "EU Central", x: 0.49, y: 0.32 },
        { name: "APAC East", x: 0.81, y: 0.48 },
        { name: "AFR Sector", x: 0.52, y: 0.62 },
        { name: "LATAM South", x: 0.30, y: 0.72 }
      ];

      staticLocs.forEach(loc => {
        const lx = loc.x * dimensions.width;
        const ly = loc.y * dimensions.height;
        ctx.fillStyle = isElectric ? 'rgba(132, 204, 22, 0.2)' : isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.1)';
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = isElectric ? '#84cc16' : isDark ? '#94a3b8' : '#64748b';
        ctx.font = '9px monospace';
        ctx.fillText(loc.name, lx + 8, ly + 3);
      });

      // Render transaction pulses
      nodesRef.current.forEach((node, idx) => {
        const nx = node.x * dimensions.width;
        const ny = node.y * dimensions.height;

        // Draw pulsing circle
        if (node.pulse > 0) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(nx, ny, 30 * (1 - node.pulse + 0.1), 0, 2 * Math.PI);
          ctx.globalAlpha = node.pulse;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
          
          node.pulse -= 0.015; // Slow decay
        }

        // Draw solid beacon node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(nx, ny, idx === 0 ? 6 : 4, 0, 2 * Math.PI);
        ctx.fill();

        // Highlight first node
        if (idx === 0) {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(nx, ny, 8, 0, 2 * Math.PI);
          ctx.strokeStyle = node.color;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Card label
          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.font = '10px monospace';
          const txtWidth = ctx.measureText(node.label).width;
          ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)';
          ctx.fillRect(nx - txtWidth/2 - 4, ny - 25, txtWidth + 8, 16);
          
          ctx.strokeStyle = node.color;
          ctx.strokeRect(nx - txtWidth/2 - 4, ny - 25, txtWidth + 8, 16);

          ctx.fillStyle = isElectric ? '#84cc16' : isDark ? '#34d399' : '#10b981';
          ctx.fillText(node.label, nx - txtWidth/2, ny - 14);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, theme]);

  return (
    <div
      ref={containerRef}
      className={`p-5 rounded-xl border relative h-full flex flex-col ${
        theme === 'electric-precision'
          ? 'bg-zinc-950 border-zinc-800 text-lime-400'
          : theme === 'sentinel-dark'
          ? 'bg-slate-900/80 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
      id="global-map-container"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Globe className={`w-4 h-4 ${theme === 'electric-precision' ? 'text-lime-400' : 'text-emerald-500'}`} />
          <h4 className="text-sm font-semibold tracking-tight">Global Transaction Map</h4>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-mono opacity-70">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'electric-precision' ? 'bg-lime-400' : 'bg-emerald-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'electric-precision' ? 'bg-lime-500' : 'bg-emerald-600'}`}></span>
          </span>
          <span>LATENCY: 14MS</span>
        </div>
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-black/40">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0 block w-full h-full"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-slate-100 dark:border-zinc-900 pt-3 opacity-85">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>SAFE FOOTPRINT</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          <span>CAUTION/WARN</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          <span>CRITICAL BLOCK</span>
        </div>
      </div>
    </div>
  );
}
