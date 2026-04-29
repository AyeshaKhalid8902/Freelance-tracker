"use client";
import { useState, useRef, useEffect } from "react";
import { Camera, ArrowLeft, Save, User, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
// getUser function bhi import karein
import { updateProfile, getUser } from "@/actions/user"; 

export default function ProfileSettings() {
  // Initial state ko khali rakhen ya default values den
  const [userData, setUserData] = useState({
    name: "",
    email: "ayeshaqq36@gmail.com", // Ye email key base par fetch karega
    bio: "",
  });

  const [isPending, setIsPending] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Naya Logic: Database se data load karne ke liye ---
  useEffect(() => {
    async function loadProfile() {
      const dbUser = await getUser(userData.email);
      if (dbUser) {
        setUserData({
          name: dbUser.name || "",
          email: dbUser.email,
          bio: dbUser.bio || "",
        });
        if (dbUser.image) setProfileImage(dbUser.image);
      }
    }
    loadProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsPending(true);
    // Image ke saath data bhejen
    const res = await updateProfile({
      ...userData,
      image: profileImage
    });
    setIsPending(false);
    
    if (res.success) {
      alert("Profile Saved Successfully!");
    } else {
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#0B0F1A] text-white antialiased">
      {/* Navigation */}
      <Link href="/settings" className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 group w-fit transition-all">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Settings</span>
      </Link>

      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
            Public <span className="text-blue-500">Profile</span>
          </h1>
          <p className="text-slate-500">Update your identity across the platform.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: AVATAR */}
          <div className="lg:col-span-4">
            <div className="bg-[#151B2D] border border-white/5 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
              <div className="relative mb-6">
                <div className="w-44 h-44 rounded-full border-4 border-blue-600/20 p-1 flex items-center justify-center bg-[#0B0F1A] overflow-hidden shadow-2xl">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600/10 text-blue-500 text-4xl font-black">
                      {userData.name ? userData.name.substring(0, 2).toUpperCase() : "AK"}
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl hover:scale-110 active:scale-95 border-4 border-[#151B2D]"
                >
                  <Camera size={20} strokeWidth={3} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black italic uppercase tracking-tight">{userData.name || "Set Your Name"}</h3>
              <p className="text-slate-500 text-xs font-bold mt-1 tracking-widest uppercase opacity-50">{userData.email}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="lg:col-span-8">
            <div className="bg-[#151B2D] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-blue-500 transition-all font-bold text-white shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="email" 
                      value={userData.email}
                      disabled // Email normaly primary key hoti hai islye disabled behtar hai
                      className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl pl-14 pr-6 py-5 outline-none opacity-50 cursor-not-allowed font-bold text-white shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">Professional Bio</label>
                <textarea 
                  rows={4}
                  value={userData.bio}
                  onChange={(e) => setUserData({...userData, bio: e.target.value})}
                  className="w-full bg-[#0B0F1A] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-blue-500 transition-all font-medium resize-none text-white/80 leading-relaxed shadow-inner"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={handleSave}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-4xl flex items-center gap-3 font-black italic uppercase text-sm shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="animate-spin" /> : <Save size={20} strokeWidth={3} />} 
                  {isPending ? "Syncing..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}