"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import Link from "next/link";
import { updateProject } from "@/actions/projectActions";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [project, setProject] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    // API call to get single project details
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setEditData(data);
      })
      .catch(err => console.error("Error fetching project:", err));
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    // Making sure we send the data in a format projectActions expects
    const res = await updateProject(id, {
      name: editData.name,
      description: editData.description,
      totalBudget: editData.totalBudget?.toString(), // Prisma action expects string to parse
      status: editData.status,
      image: editData.image
    });

    if (res?.success) {
      alert("Project Updated Successfully!");
      setIsEditModalOpen(false);
      window.location.reload();
    } else {
      alert("Error updating project. Check console.");
    }
  };

  if (!project) return (
    <div className="h-screen w-full bg-[#0B0F1A] flex items-center justify-center">
      <div className="text-white font-mono animate-pulse text-lg">Accessing Project Pipeline...</div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#0B0F1A] text-white flex flex-col overflow-hidden">
      
      <div className="w-full max-w-7xl mx-auto px-8 py-6 flex flex-col h-full">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/projects" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Gallery
          </Link>
          <button 
            onClick={() => setIsEditModalOpen(true)} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
          >
            Edit Project
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-10 flex-1 min-h-0 pb-10">
          
          <div className="w-full md:w-5/12 flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
                {project.name}
              </h1>
              <div className="flex gap-3 items-center">
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase">
                  {project.status || "Pending"}
                </span>
                <span className="text-slate-500 text-sm font-mono">
                  Budget: ${project.totalBudget || 0}
                </span>
              </div>
            </div>

            <div className="bg-[#151B2D] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
              <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Project Overview</h3>
              <p className="text-slate-400 text-base leading-relaxed overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                {project.description || "No description provided for this pipeline project."}
              </p>
            </div>
          </div>

          <div className="w-full md:w-7/12 h-full min-h-0">
            <div className="relative h-full w-full rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
              <img 
                src={project.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                alt={project.name}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151B2D] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-6 italic">Update System Data</h2>

            <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="relative w-full h-32 bg-black/20 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                {editData?.image ? (
                  <img src={editData.image} className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} className="text-slate-600" />
                )}
                <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold uppercase">
                  Change Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <input 
                placeholder="Project Name"
                value={editData?.name || ""} 
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                onChange={e => setEditData({...editData, name: e.target.value})} 
              />

              {/* Updated to totalBudget Field */}
              <input 
                type="number"
                placeholder="Total Budget ($)"
                value={editData?.totalBudget || ""} 
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                onChange={e => setEditData({...editData, totalBudget: e.target.value})} 
              />

              <textarea 
                placeholder="Project Description"
                value={editData?.description || ""} 
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-sm h-32 outline-none focus:border-blue-500 resize-none transition-all"
                onChange={e => setEditData({...editData, description: e.target.value})} 
              />

              <button 
                onClick={handleUpdate} 
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}