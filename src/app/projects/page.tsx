"use client";
import { useState, useEffect } from "react";
import { Plus, ExternalLink, X, Camera } from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "@/actions/dashboardActions";
import { createProject } from "@/actions/projectActions";

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]); // 👈 Clients state add ki
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newProject, setNewProject] = useState({ 
    title: "", 
    description: "", 
    category: "", 
    budget: "",
    image: "",
    clientId: "" // 👈 clientId field add ki
  });

  useEffect(() => {
    async function load() {
  try {
    // data: any likhne se error khatam ho jayega
    const data: any = await getDashboardData(); 
    
    setProjects(data.projects || []);
    setClients(data.clients || []); // 👈 Ab yahan error nahi aayega
  } catch (e) { 
    console.error("Fetch Error:", e); 
  } finally { 
    setLoading(false); 
  }
}
    load();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject({ ...newProject, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.image) return alert("Please select an image!");
    if (!newProject.clientId) return alert("Please select a client!"); // Validation

    try {
      const res = await createProject({
        ...newProject,
        budget: Number(newProject.budget),
        clientId: newProject.clientId, // 👈 Ab ye dropdown se selected ID bhejega
        status: "ACTIVE"
      });

      if (res.success) {
        alert("Project Launched!");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) { 
      alert("Failed to connect to server."); 
    }
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#0B0F1A] flex items-center justify-center text-white font-mono animate-pulse">
      Accessing Portfolio Pipeline...
    </div>
  );

  return (
    <div className="p-6 lg:p-10 bg-[#0B0F1A] min-h-screen text-white flex flex-col">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-blue-500 text-[10px] font-black tracking-widest uppercase mb-2">Portfolio Pipeline</h2>
          <h1 className="text-5xl font-bold tracking-tight">Projects Gallery</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest transition-all active:scale-95 w-fit"
        >
          <Plus size={20} /> Add Project
        </button>
      </header>
      
      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-[3rem] min-h-[400px]">
          <p className="text-slate-500 italic">No projects found. Launch your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {projects.map((project) => (
            <div key={project.id} className="group bg-[#151B2D] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all shadow-2xl flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img src={project.image || "/api/placeholder/400/320"} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6">{project.description || 'No description provided.'}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                   <div className="text-blue-500 font-bold">${project.budget}</div>
                   <Link href={`/projects/${project.id}`} className="text-slate-400 hover:text-white transition-colors">
                      <ExternalLink size={18} />
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#151B2D] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold mb-6 italic underline decoration-blue-500/50">New Pipeline Project</h2>
            
            <form onSubmit={handleLaunch} className="space-y-4">
              {/* Image Upload */}
              <div className="relative group w-full h-32 bg-black/20 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                {newProject.image ? (
                  <img src={newProject.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <><Camera size={24} className="text-slate-600 mb-2" /><span className="text-[10px] text-slate-600 font-bold uppercase">Select Image</span></>
                )}
                <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
              </div>

              {/* Client Selection - AB YEH LIVE HAI */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Assign Client</label>
                <select 
                  required 
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-all text-white appearance-none cursor-pointer"
                  value={newProject.clientId}
                  onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                >
                  <option value="" className="text-slate-500">Choose Client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id} className="bg-[#151B2D] text-white">
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <input required placeholder="Project Title" className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-all" 
                onChange={e => setNewProject({...newProject, title: e.target.value})} />
              
              <textarea placeholder="Brief Description" className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-blue-500 h-24 resize-none transition-all"
                onChange={e => setNewProject({...newProject, description: e.target.value})} />
              
              <input type="number" required placeholder="Budget ($)" className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-all"
                onChange={e => setNewProject({...newProject, budget: e.target.value})} />
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">
                Launch Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}