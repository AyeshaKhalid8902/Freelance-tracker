"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, Loader2, Save } from "lucide-react";

export default function SecuritySettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Form State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }

    setLoading(true);
    // Fake API Delay
    setTimeout(() => {
      setLoading(false);
      alert("Password updated successfully! 🔒");
      router.push("/settings");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 group transition-colors"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">Back to Settings</span>
      </button>

      <div className="max-w-2xl">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Account Security</h1>
          </div>
          <p className="text-slate-500 text-sm ml-16">Update your password to keep your account secure.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="bg-[#151B2D] border border-white/5 p-8 rounded-[2.5rem] space-y-4 focus-within:border-emerald-500/50 transition-all">
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Lock size={14}/> Current Password
            </label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-lg focus:outline-none focus:border-emerald-500 transition-colors" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* New Password Group */}
          <div className="bg-[#151B2D] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="space-y-4">
              <label className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={14}/> New Password
              </label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-lg focus:outline-none focus:border-emerald-500 transition-colors" 
                  placeholder="Minimum 8 characters"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 bottom-2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Confirm New Password
              </label>
              <input 
                type={showPass ? "text" : "password"} 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-lg focus:outline-none focus:border-emerald-500 transition-colors" 
                placeholder="Repeat new password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-5 rounded-4xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <><Save size={20} /> Update Password</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}