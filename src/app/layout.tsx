"use client";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import AIChatbot from "@/components/AIChatbot";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing Freelance Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-black">
      {!isLoginPage && <Sidebar />}
      
      {/* Main Content Area: Margin aur Width fix ki gayi hai */}
      <main className={`flex-1 transition-all duration-300 min-h-screen ${
        !isLoginPage ? "md:ml-64" : "w-full"
      }`}>
        {/* max-w-400px ko hata kar max-w-[1600px] ya full kiya gaya hai */}
        <div className="w-full max-w-375px mx-auto p-4 lg:p-10">
          {children}
        </div>
      </main>

      {!isLoginPage && <AIChatbot />}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <SessionProvider>
          <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}