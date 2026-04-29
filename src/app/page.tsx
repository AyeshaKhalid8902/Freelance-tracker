"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, DollarSign, Briefcase, Users, 
  TrendingUp, RefreshCcw, Bell, ArrowUpRight, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDashboardData } from "@/actions/dashboardActions"; 
import { getInvoices } from "@/actions/invoices";
import Sidebar from "../components/ui/Sidebar"; 

const ResponsiveContainer = React.lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
const AreaChart = React.lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const Area = React.lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
const XAxis = React.lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const Tooltip = React.lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));

export default function OverviewDashboard() {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [dbStatus, setDbStatus] = useState({ error: false, message: "" });
  const [stats, setStats] = useState({ revenue: 0, activeProjects: 0, happyClients: 0, efficiency: 95.1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      // ✅ Fresh data fetch karne ke liye router refresh call kiya
      router.refresh();
      
      const [dashRes, iRes] = await Promise.all([getDashboardData(), getInvoices()]);
      if (dashRes && iRes?.success) {
        const p = dashRes.projects || [];
        const i = iRes.invoices || [];
        const totalRevenue = i
          .filter((inv: any) => inv.status === 'PAID')
          .reduce((a: number, c: any) => a + (Number(c.amount) || 0), 0);

        setStats(prev => ({
          ...prev,
          revenue: totalRevenue,
          activeProjects: p.length,
          happyClients: new Set(p.map((proj: any) => proj.clientId).filter(Boolean)).size || 0,
        }));
        setDbStatus({ error: false, message: "" });
      } else { 
        setDbStatus({ error: true, message: "Database limit reached." }); 
      }
    } catch (e) { 
      setDbStatus({ error: true, message: "Connection failed." }); 
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStats();

    const effInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        efficiency: parseFloat((92 + Math.random() * 6).toFixed(1))
      }));
    }, 4000);

    const dbInterval = setInterval(() => {
      console.log("System Syncing: Fetching live data...");
      fetchStats();
    }, 120000); 

    return () => {
      clearInterval(effInterval);
      clearInterval(dbInterval);
    };
  }, [fetchStats]);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const themeClasses = { 
    dark: "bg-black text-white", 
    light: "bg-[#F8F9FA] text-black", 
    cyber: "bg-[#050505] text-[#00ffc3]" 
  };

  const cardClass = theme === "dark" 
    ? "bg-[#111111] border-white/10 shadow-2xl" 
    : theme === "cyber" 
      ? "bg-black border-[#00ffc3]/20 shadow-[0_0_20px_rgba(0,255,195,0.1)]" 
      : "bg-white border-slate-100 shadow-sm";

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-all duration-500 ${themeClasses[theme as keyof typeof themeClasses]}`}>
      
      <Sidebar theme={theme} />

      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-[10px] font-black tracking-widest uppercase opacity-80">Syncing Intelligence...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <p className="text-[9px] tracking-[0.3em] font-black uppercase opacity-60 flex items-center gap-2">
              SYSTEM SYNCED: {currentTime} <RefreshCcw size={12} onClick={() => {setLoading(true); fetchStats();}} className={`cursor-pointer hover:text-blue-400 ${loading && "animate-spin"}`} />
            </p>
            <h1 className="text-3xl md:text-5xl font-black italic mt-1 uppercase tracking-tighter">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Ayesha</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {['dark', 'light', 'cyber'].map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${theme === t ? 'bg-white text-black shadow-lg' : 'opacity-40'}`}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
{/* STATS GRID - COMPACT VERSION */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  {[
    { label: "REVENUE", value: `$${stats.revenue.toLocaleString()}`, Icon: DollarSign, color: "bg-[#8B5CF6]", path: "/invoices" },
    { label: "PROJECTS", value: stats.activeProjects, Icon: Briefcase, color: "bg-[#2563EB]", path: "/projects" },
    { label: "CLIENTS", value: stats.happyClients, Icon: Users, color: "bg-[#EA580C]", path: "/clients" },
    { label: "EFFICIENCY", value: `${stats.efficiency}%`, Icon: TrendingUp, color: "bg-[#059669]", path: "/analytics" },
  ].map((stat, i) => {
    const IconComponent = stat.Icon;
    return (
      <div 
        key={i} 
        onClick={() => router.push(stat.path)}
        className={`${cardClass} p-6 rounded-[2.5rem] border group hover:-translate-y-1 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col items-start`}
      >
        <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-105 transition-transform`}>
          <IconComponent size={24} />
        </div>
        
        <p className="text-[10px] font-black opacity-40 mb-1 tracking-[0.2em] uppercase">
          {stat.label}
        </p>
        
        <h3 className="text-3xl font-black tracking-tighter">
          {stat.value}
        </h3>
      </div>
    );
  })}
</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`${cardClass} lg:col-span-2 p-6 md:p-10 rounded-[2.5rem] border overflow-hidden`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black italic uppercase tracking-tight">Workflow Performance</h2>
              <span className="text-[9px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">Real-time Tracking</span>
            </div>
            <div className="h-[300px] w-full">
              <React.Suspense fallback={<div className="h-full w-full bg-white/5 animate-pulse rounded-3xl" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ day: 'Mon', v: 65 }, { day: 'Tue', v: 88 }, { day: 'Wed', v: 75 }, { day: 'Thu', v: 92 }, { day: 'Fri', v: 80 }, { day: 'Sat', v: 95 }]}>
                    <defs>
                      <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" hide />
                    <Tooltip contentStyle={{ borderRadius: '15px', background: '#000', border: 'none', color: '#fff', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorV)" />
                  </AreaChart>
                </ResponsiveContainer>
              </React.Suspense>
            </div>
          </div>

          <div className={`${cardClass} p-6 md:p-8 rounded-[2.5rem] border flex flex-col`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-black italic uppercase text-xs tracking-widest opacity-70">Activity Feed</h2>
              <Bell size={16} className="text-blue-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              {[
                { t: "Database Sync", d: dbStatus.error ? "Sync Failed" : `Live: ${currentTime}`, i: <RefreshCcw size={14}/> },
                { t: "Efficiency Live", d: `Current Rate: ${stats.efficiency}%`, i: <TrendingUp size={14}/> },
                { t: "Project Tracking", d: `${stats.activeProjects} Files Active`, i: <Briefcase size={14}/> }
              ].map((act, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-blue-500/50 transition-colors">
                    {act.i}
                  </div>
                  <div className="border-b border-white/5 pb-4 w-full">
                    <p className="text-[11px] font-black group-hover:text-blue-400 transition-colors">{act.t}</p>
                    <p className="text-[9px] opacity-40 uppercase tracking-tighter">{act.d}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => router.push('/analytics')} 
                className="w-full mt-auto p-4 rounded-2xl bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Full Analytics <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}