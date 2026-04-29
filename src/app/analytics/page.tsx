"use client";
import { TrendingUp, Zap, ArrowLeft, Clock, Target, Activity, RefreshCcw, FileDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");
  
  // LIVE STATES
  const [metrics, setMetrics] = useState({
    productivity: 94.2,
    frontend: 95.1,
    backend: 88.0,
    db: 92.0
  });

  // Chart Data State
  const [chartData, setChartData] = useState([
    { name: 'Mon', val: 4000 },
    { name: 'Tue', val: 3000 },
    { name: 'Wed', val: 2000 },
    { name: 'Thu', val: 2780 },
    { name: 'Fri', val: 1890 },
    { name: 'Sat', val: 2390 },
    { name: 'Sun', val: 3490 },
  ]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      
      // Live Simulation: Metrics update
      setMetrics(prev => ({
        ...prev,
        productivity: +(prev.productivity + (Math.random() * 0.1 - 0.05)).toFixed(1),
        frontend: +(prev.frontend + (Math.random() * 0.2 - 0.1)).toFixed(1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const downloadReport = () => {
    const reportData = `
      FREELANCE TRACKER - PERFORMANCE REPORT
      Date: ${new Date().toLocaleDateString()}
      Time: ${time}
      --------------------------------------
      Overall Productivity: ${metrics.productivity}%
      Frontend Development: ${metrics.frontend}%
      Backend (Prisma): ${metrics.backend}%
      Database Optimization: ${metrics.db}%
      --------------------------------------
      Status: System Synced and Healthy.
    `;
    
    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Ayesha_Report_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-6 md:p-12 text-white animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h2 className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2">
              Live Monitoring <RefreshCcw size={10} className="animate-spin" />
            </h2>
            <h1 className="text-4xl font-bold tracking-tight italic">Efficiency Analytics</h1>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Productivity", value: `${metrics.productivity}%`, icon: Zap, color: "text-yellow-400" },
            { label: "Growth", value: "+12.5%", icon: TrendingUp, color: "text-blue-400" },
            { label: "Tasks", value: "48", icon: Target, color: "text-emerald-400" },
          ].map((s, i) => (
            <div key={i} className="bg-[#151B2D] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-4 ${s.color}`}><s.icon size={24} /></div>
              <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{s.label}</p>
              <h3 className="text-3xl font-black tabular-nums">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#151B2D] border border-white/5 rounded-[40px] p-10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold italic">Workflow Performance</h3>
              <Activity className="text-blue-500 animate-pulse" />
            </div>

            {/* CHART CONTAINER - Fixed Height to prevent 0 width error */}
            <div className="h-[250px] w-full min-h-[250px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}}
                  />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#3b82f6' : '#3b82f640'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-6">
              {[
                { name: "Frontend Development", val: metrics.frontend, color: "bg-blue-500" },
                { name: "Backend Logic (Prisma)", val: metrics.backend, color: "bg-purple-500" },
                { name: "Database Optimization", val: metrics.db, color: "bg-emerald-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-slate-400">{item.name}</span>
                    <span className="tabular-nums">{item.val}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 inline-flex items-center gap-3 text-[10px] font-black text-blue-400 bg-blue-500/5 px-6 py-4 rounded-2xl border border-blue-500/10 uppercase tracking-widest">
              <Clock size={14} className="animate-pulse" /> System Synced: {time}
            </div>
          </div>

          {/* Activity & Download */}
          <div className="bg-[#151B2D] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-blue-400">Recent Milestones</h4>
              <div className="space-y-6">
                {[
                  { t: "Dashboard Clickable Logic", s: "COMPLETED", time: "2 HOURS AGO" },
                  { t: "Analytics Route Created", s: "ACTIVE", time: "JUST NOW" },
                  { t: "Prisma Schema Updated", s: "SYNCED", time: "YESTERDAY" }
                ].map((m, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                    <div>
                      <p className="text-xs font-bold leading-tight mb-1">{m.t}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black opacity-40">{m.time}</span>
                        <span className="text-[7px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{m.s}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={downloadReport}
              className="mt-8 w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-[2rem] hover:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 hover:text-white"
            >
              <FileDown size={16} /> Download Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}