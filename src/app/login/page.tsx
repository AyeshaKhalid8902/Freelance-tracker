"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Github, Chrome, ShieldCheck, LogOut, ArrowRight, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState(false);

  // Captcha status handler
  const handleCaptchaChange = (value: string | null) => {
    if (value) setIsVerified(true);
    else setIsVerified(false);
  };

  // --- 1. SIGNED IN PROFILE UI ---
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center p-6 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-105 bg-[#111827]/80 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-xl text-center"
        >
          {session.user?.image ? (
            <img src={session.user.image} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-blue-500 shadow-xl" />
          ) : (
            <UserCircle size={80} className="text-slate-700 mx-auto mb-6" />
          )}
          
          <h1 className="text-3xl font-extrabold tracking-tighter mb-2">Welcome Back!</h1>
          <p className="text-white text-xl font-medium mb-1">{session.user?.name}</p>
          <p className="text-slate-500 text-sm font-semibold mb-8 border-l-2 border-blue-500 pl-4">{session.user?.email}</p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 py-4 rounded-2xl text-base font-bold hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out from Account
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-base font-bold transition-all shadow-xl shadow-blue-600/20 group"
            >
              Go to Dashboard
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- 2. SIGN IN FORM UI (Updated Order) ---
  return (
    <div className="min-h-screen bg-[#060B18] flex items-center justify-center p-6 text-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-112.5 bg-[#111827]/80 p-10 lg:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-500/30 shadow-lg shadow-blue-600/10"
          >
            <ShieldCheck className="text-blue-500" size={32} />
          </motion.div>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tighter">Freelance Tracker Pro<span className="text-blue-500">.</span></h1>
          <p className="text-slate-500 text-sm mt-3 font-medium uppercase tracking-[0.2em] border-l border-white/5 pl-4">Verify Identity</p>
        </div>

        {/* --- Social Buttons (Now First) --- */}
        <div className="space-y-4 mb-8">
          <button 
            disabled={!isVerified}
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className={`w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold transition-all shadow-xl group ${!isVerified ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}`}
          >
            <Github size={24} className="group-hover:scale-110 transition-transform" />
            Continue with GitHub
          </button>

          <button 
            disabled={!isVerified}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className={`w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold transition-all shadow-xl group ${!isVerified ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10 cursor-pointer"}`}
          >
            <Chrome size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
            Continue with Google
          </button>
        </div>

        {/* --- Divider --- */}
        <div className="relative mb-8 flex items-center">
            <div className="grow border-t border-white/5"></div>
            <span className="mx-4 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Security Check</span>
            <div className="grow border-t border-white/5"></div>
        </div>

        {/* --- reCAPTCHA (Now Below) --- */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-black/20 p-4 rounded-xl border border-white/5 w-full flex justify-center">
            <ReCAPTCHA
              sitekey="6LfdaLgsAAAAANcwcM-uwf5pW39bSbjhb-S1V5FW"
              onChange={handleCaptchaChange}
              theme="dark"
              size="normal"
            />
          </div>

          {!isVerified && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-blue-500 text-center mt-4 font-bold uppercase tracking-[0.2em] animate-pulse"
            >
              Please verify you are not a robot to login
            </motion.p>
          )}
        </div>

        <div className="relative mt-12 flex items-center">
           <div className="grow border-t border-white/5"></div>
           <span className="mx-4 text-[10px] text-slate-800 font-bold uppercase tracking-[0.2em]">Freelance-Tracker Security</span>
           <div className="grow border-t border-white/5"></div>
        </div>
      </motion.div>
    </div>
  );
}