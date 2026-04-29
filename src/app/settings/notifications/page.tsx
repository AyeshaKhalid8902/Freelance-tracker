"use client";
import { useState, useEffect } from "react";
import { Bell, Mail, Monitor, MessageSquare, Loader2 } from "lucide-react";
import { getUser, updateNotifications } from "@/actions/user";

// TypeScript Error fix karne ke liye ye type define karein
type NotificationField = "emailNotify" | "desktopNotify" | "inquiryNotify";

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({
    emailNotify: true,
    desktopNotify: true,
    inquiryNotify: true,
  });
  const [isPending, setIsPending] = useState(false);

  // Database se load karein
  useEffect(() => {
    async function loadData() {
      // Direct database fetch logic
      const user = await getUser("ayeshaqq36@gmail.com"); 
      if (user) {
        setPrefs({
          emailNotify: !!user.emailNotify,
          desktopNotify: !!user.desktopNotify,
          inquiryNotify: !!user.inquiryNotify,
        });
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsPending(true);
    // Server action to sync with PostgreSQL
    const res = await updateNotifications("ayeshaqq36@gmail.com", prefs);
    setIsPending(false);
    
    if (res.success) {
      alert("Preferences Saved!"); // Successful sync alert
    } else {
      alert("Error saving preferences. Please check your database.");
    }
  };

  // NotificationItem with strict typing for 'field'
  const NotificationItem = ({ title, desc, icon: Icon, field }: { 
    title: string; 
    desc: string; 
    icon: any; 
    field: NotificationField 
  }) => (
    <div className="flex items-center justify-between p-6 bg-[#151B2D] border border-white/5 rounded-3xl mb-4 transition-all hover:border-white/10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-2xl text-orange-400">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="text-slate-500 text-sm">{desc}</p>
        </div>
      </div>
      <button 
        type="button"
        onClick={() => setPrefs(prev => ({ ...prev, [field]: !prev[field] }))}
        className={`w-14 h-8 rounded-full transition-all duration-300 relative ${prefs[field] ? 'bg-orange-500' : 'bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${prefs[field] ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex items-center gap-4">
        <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
          <Bell size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-slate-500">Configure how you want to be alerted about your work.</p>
        </div>
      </div>

      <div className="space-y-2">
        <NotificationItem title="Email Notifications" desc="Updates on your registered email" icon={Mail} field="emailNotify" />
        <NotificationItem title="Desktop Push" desc="Real-time alerts on your computer" icon={Monitor} field="desktopNotify" />
        <NotificationItem title="New Inquiries" desc="Alerts for new client messages" icon={MessageSquare} field="inquiryNotify" />
      </div>

      {/* Action Button */}
      <button 
        onClick={handleSave}
        disabled={isPending}
        className="w-full mt-8 bg-orange-600 hover:bg-orange-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Saving Changes...
          </>
        ) : (
          "Save Preferences"
        )}
      </button>
    </div>
  );
}