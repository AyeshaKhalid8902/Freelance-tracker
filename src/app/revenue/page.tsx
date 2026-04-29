"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";

export default function RevenuePage() {
  const router = useRouter();

  return (
    <div className="p-6 lg:p-10 text-white min-h-screen bg-[(--bg-main)]">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold mb-6">Revenue Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[(--bg-card)] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
          <h2 className="text-3xl font-black">$4,250.00</h2>
        </div>

        <div className="bg-[(--bg-card)] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Monthly Growth</p>
          <h2 className="text-3xl font-black">+12.5%</h2>
        </div>
      </div>
    </div>
  );
}