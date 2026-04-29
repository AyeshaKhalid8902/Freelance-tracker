"use client";

import React, { useState, useEffect } from "react";
import { Plus, CheckCircle2, MoreVertical, Trash2, Loader2, X, Circle } from "lucide-react";
import { createNewTask, getDashboardData, deleteTask, updateTaskStatus } from "@/actions/dashboardActions";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [issubmitting, setIsSubmitting] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setTasks(data.tasks || []);
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Circle Click Logic (Sirf Done/Undone ke liye)
  const handleCircleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "DONE" ? "PENDING" : "DONE";
    updateUIAndDb(id, newStatus);
  };

  // 2. Status Text Click Logic (Cycle through: PENDING -> IN_PROGRESS -> DONE)
  const handleTextStatusToggle = async (id: string, currentStatus: string) => {
    let newStatus = "";
    
    if (currentStatus === "PENDING" || currentStatus === "DRAFT") {
      newStatus = "IN_PROGRESS";
    } else if (currentStatus === "IN_PROGRESS") {
      newStatus = "DONE";
    } else {
      newStatus = "PENDING";
    }

    updateUIAndDb(id, newStatus);
  };

  // Helper function to update UI and DB
  const updateUIAndDb = async (id: string, newStatus: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await updateTaskStatus(id, newStatus);
    } catch (err) {
      fetchData();
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !selectedProjectTitle) return alert("Please fill all fields");
    setIsSubmitting(true);
    try {
      const result = await createNewTask({
        title: newTitle,
        category: selectedProjectTitle,
        status: "PENDING",
        image: "" 
      });
      if (result.success) {
        setNewTitle(""); setSelectedProjectTitle(""); setIsModalOpen(false);
        await fetchData(); 
      }
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const result = await deleteTask(id);
    if (result.success) { await fetchData(); setActiveMenu(null); }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6 md:p-10 relative">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-blue-500 text-[10px] font-black tracking-widest uppercase mb-2">Centralized Hub</p>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Manage <span className="text-blue-500">Tasks</span></h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-8 py-4 rounded-2xl font-black italic text-sm hover:scale-105 transition-all shadow-lg shadow-blue-600/20">
          <Plus size={20} strokeWidth={3} className="inline mr-2" /> NEW ASSIGNMENT
        </button>
      </div>

      <div className="bg-[#151B2D] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/[0.02] text-[11px] uppercase tracking-widest text-blue-400 font-black border-b border-white/5">
            <tr>
              <th className="p-8">Assignment Details</th>
              <th className="p-8 text-center">Project</th>
              <th className="p-8 text-center">Status</th>
              <th className="p-8 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tasks.map((task) => {
              const isDone = task.status === "DONE";
              const isInProgress = task.status === "IN_PROGRESS";
              
              return (
                <tr key={task.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <button onClick={() => handleCircleToggle(task.id, task.status)} className="hover:scale-110 transition-transform">
                        {isDone ? <CheckCircle2 size={24} className="text-green-500 fill-green-500/10" strokeWidth={2.5} /> : <Circle size={24} className="text-white/20 hover:text-blue-500" strokeWidth={2.5} />}
                      </button>
                      <span className={`text-lg font-bold transition-all duration-300 ${isDone ? "line-through opacity-30 text-slate-400" : "text-white"}`}>
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {task.category || "General"}
                    </span>
                  </td>
                  
                  {/* Clickable Status Column */}
                  <td className="p-8 text-center">
                    <button 
                      onClick={() => handleTextStatusToggle(task.id, task.status)}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/5 active:scale-95 group/status`}
                    >
                      <span className={`text-[11px] font-black uppercase tracking-widest block ${
                        isDone ? "text-green-500" : isInProgress ? "text-yellow-500" : "text-blue-500/60"
                      }`}>
                        {isDone ? "Completed" : isInProgress ? "In Progress" : "Pending"}
                      </span>
                      <div className={`h-[2px] mt-1 mx-auto transition-all duration-500 ${
                        isDone ? "bg-green-500 w-full" : isInProgress ? "bg-yellow-500 w-2/3" : "bg-blue-500/20 w-1/3"
                      }`} />
                    </button>
                  </td>

                  <td className="p-8 text-right relative">
                    <button onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <MoreVertical size={20} className="text-slate-500" />
                    </button>
                    {activeMenu === task.id && (
                      <div className="absolute right-10 top-16 w-44 bg-[#1A2235] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                        <button onClick={() => handleDelete(task.id)} className="w-full px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors">
                          <Trash2 size={14}/> Delete Task
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal code remains the same */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#151B2D] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black italic uppercase">Add <span className="text-blue-500">Task</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-blue-400">Task Title</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Task Title" className="w-full bg-black/20 border border-white/5 p-4 rounded-xl focus:border-blue-500 outline-none transition-all text-white" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase opacity-40 mb-2 block tracking-widest text-blue-400">Assign to Project</label>
                <select value={selectedProjectTitle} onChange={(e) => setSelectedProjectTitle(e.target.value)} className="w-full bg-black/20 border border-white/5 p-4 rounded-xl focus:border-blue-500 outline-none text-white">
                  <option value="" disabled>Select a Project</option>
                  {projects.map(p => <option key={p.id} value={p.title} className="bg-[#151B2D]">{p.title}</option>)}
                </select>
              </div>
              <button type="submit" disabled={issubmitting} className="w-full bg-blue-600 p-4 rounded-2xl font-black uppercase italic hover:bg-blue-500 transition-all flex justify-center items-center gap-2">
                {issubmitting ? <Loader2 className="animate-spin" /> : "Confirm Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}