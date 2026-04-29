// "use client";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { LayoutGrid, Briefcase, Users, CheckSquare, Zap, Settings, FileText } from "lucide-react";
// import { getUser } from "@/actions/user";

// export default function Sidebar({ theme = "dark" }) {
//   const pathname = usePathname();
  
//   const [userData, setUserData] = useState({
//     name: "Ayesha Khalid",
//     email: "ayeshaqq36@gmail.com",
//     image: null as string | null
//   });

//   useEffect(() => {
//     async function loadUserData() {
//       try {
//         const dbUser = await getUser(userData.email);
//         if (dbUser) {
//           setUserData({
//             name: dbUser.name || "Ayesha Khalid",
//             email: dbUser.email,
//             image: dbUser.image || null,
//           });
//         }
//       } catch (error) {
//         console.error("Sidebar data fetch error:", error);
//       }
//     }
//     loadUserData();
//   }, [pathname]);

//   const menuItems = [
//     { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
//     { name: "Projects", icon: Briefcase, href: "/projects" },
//     { name: "Clients", icon: Users, href: "/clients" },
//     { name: "Tasks", icon: CheckSquare, href: "/tasks" },
//     { name: "Invoices", icon: FileText, href: "/invoices" },
//   ];

//   const sidebarStyles = {
//     dark: "bg-black border-white/5 text-white shadow-[20px_0_50px_rgba(0,0,0,0.8)]",
//     light: "bg-white border-slate-200 text-slate-900 shadow-[10px_0_30px_rgba(0,0,0,0.05)]",
//     cyber: "bg-[#050505] border-[#00ffc3]/20 text-[#00ffc3] shadow-[0_0_30px_rgba(0,255,195,0.05)]"
//   };

//   const current = sidebarStyles[theme as keyof typeof sidebarStyles] || sidebarStyles.dark;

//   return (
//     <aside className={`fixed left-0 top-0 h-screen w-64 z-9999 flex flex-col py-6 border-r transition-all duration-500 ${current}`}>
      
//       <div className="px-8 mb-8">
//         <h1 className={`font-bold text-xl tracking-tight ${theme === 'light' ? 'text-black' : ''}`}>Freelance Tracker</h1>
//       </div>

//       <div className="px-7 mb-4 flex items-center gap-2 group">
//         <Link href="/" className="relative hover:scale-110 transition-all">
//           <div className="absolute -inset-1 bg-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40"></div>
//           <div className={`relative p-1.5 rounded-lg border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0a0a] border-white/10'}`}>
//             <Zap size={16} className="text-blue-500 fill-blue-500/10" />
//           </div>
//         </Link>
//         <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Overdashboard</p>
//       </div>

//       <nav className="flex flex-col gap-1 px-3">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link key={item.name} href={item.href} 
//               className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
//                 isActive ? (theme === 'light' ? 'bg-blue-50/50' : 'bg-white/10') : (theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5')
//               }`}
//             >
//               <item.icon size={18} className={isActive ? "text-blue-500" : "text-slate-500 group-hover:text-blue-400"} />
//               <span className={`text-sm font-medium ${isActive ? (theme === 'light' ? 'text-blue-600' : 'text-white') : "text-slate-500 group-hover:text-slate-300"}`}>
//                 {item.name}
//               </span>
//               {isActive && (
//                 <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[4px_0_12px_rgba(59,130,246,0.5)]" />
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="mt-auto px-3">
//         <Link href="/settings" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${theme === 'light' ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-500 hover:bg-white/5'}`}>
//           <Settings size={18} className="group-hover:rotate-90 transition-transform duration-700" />
//           <span className="text-sm font-medium">Settings</span>
//         </Link>

//         {/* ✅ FIX: Path ko change kar ke "/settings/profile" kar diya gaya hai */}
//         <Link href="/settings" 
//           className={`mt-4 p-3 border rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
//             theme === 'light' 
//               ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm' 
//               : 'bg-white/5 border-white/5 hover:bg-white/10 shadow-lg shadow-black/20'
//           }`}
//         >
//           <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner overflow-hidden">
//             {userData.image ? (
//               <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
//             ) : (
//               userData.name.substring(0, 2).toUpperCase()
//             )}
//           </div>
          
//           <div className="flex flex-col min-w-0">
//             <span className={`text-xs font-bold truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
//               {userData.name}
//             </span>
//             <span className="text-[9px] text-slate-500 truncate leading-none mt-1">
//               {userData.email}
//             </span>
//           </div>
//         </Link>
//       </div>
//     </aside>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Briefcase, Users, CheckSquare, Zap, Settings, FileText, Menu, X } from "lucide-react";
import { getUser } from "@/actions/user";

export default function Sidebar({ theme = "dark" }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile state

  const [userData, setUserData] = useState({
    name: "Ayesha Khalid",
    email: "ayeshaqq36@gmail.com",
    image: null as string | null
  });

  // Jab page change ho to mobile par sidebar band ho jaye
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadUserData() {
      try {
        const dbUser = await getUser(userData.email);
        if (dbUser) {
          setUserData({
            name: dbUser.name || "Ayesha Khalid",
            email: dbUser.email,
            image: dbUser.image || null,
          });
        }
      } catch (error) {
        console.error("Sidebar data fetch error:", error);
      }
    }
    loadUserData();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Projects", icon: Briefcase, href: "/projects" },
    { name: "Clients", icon: Users, href: "/clients" },
    { name: "Tasks", icon: CheckSquare, href: "/tasks" },
    { name: "Invoices", icon: FileText, href: "/invoices" },
  ];

  const sidebarStyles = {
    dark: "bg-black border-white/5 text-white shadow-[20px_0_50px_rgba(0,0,0,0.8)]",
    light: "bg-white border-slate-200 text-slate-900 shadow-[10px_0_30px_rgba(0,0,0,0.05)]",
    cyber: "bg-[#050505] border-[#00ffc3]/20 text-[#00ffc3] shadow-[0_0_30px_rgba(0,255,195,0.05)]"
  };

  const current = sidebarStyles[theme as keyof typeof sidebarStyles] || sidebarStyles.dark;

  return (
    <>
      {/* --- Hamburger Button (Visible only on Mobile) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 left-5 z-[10000] p-2 rounded-lg lg:hidden border transition-all ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-black border-white/10 text-white'
        }`}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* --- Overlay (Click to close on Mobile) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 z-[9999] flex flex-col py-6 border-r transition-all duration-500
        ${current}
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        
        <div className="px-8 mb-8">
          <h1 className={`font-bold text-xl tracking-tight ${theme === 'light' ? 'text-black' : ''}`}>Freelance Tracker</h1>
        </div>

        <div className="px-7 mb-4 flex items-center gap-2 group">
          <Link href="/" className="relative hover:scale-110 transition-all">
            <div className="absolute -inset-1 bg-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40"></div>
            <div className={`relative p-1.5 rounded-lg border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0a0a] border-white/10'}`}>
              <Zap size={16} className="text-blue-500 fill-blue-500/10" />
            </div>
          </Link>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Overdashboard</p>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} 
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive ? (theme === 'light' ? 'bg-blue-50/50' : 'bg-white/10') : (theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5')
                }`}
              >
                <item.icon size={18} className={isActive ? "text-blue-500" : "text-slate-500 group-hover:text-blue-400"} />
                <span className={`text-sm font-medium ${isActive ? (theme === 'light' ? 'text-blue-600' : 'text-white') : "text-slate-500 group-hover:text-slate-300"}`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[4px_0_12px_rgba(59,130,246,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-3">
          <Link href="/settings" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${theme === 'light' ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-500 hover:bg-white/5'}`}>
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-700" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <Link href="/settings" 
            className={`mt-4 p-3 border rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
              theme === 'light' 
                ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 shadow-lg shadow-black/20'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-inner overflow-hidden">
              {userData.image ? (
                <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userData.name.substring(0, 2).toUpperCase()
              )}
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                {userData.name}
              </span>
              <span className="text-[9px] text-slate-500 truncate leading-none mt-1">
                {userData.email}
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}