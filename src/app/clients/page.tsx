"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Trash, RefreshCw, CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Aapka server action connectivity
import { getClients, createClient, deleteClient } from "@/actions/clients";

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    setIsSyncing(true);
    try {
      const data = await getClients();
      if (Array.isArray(data)) {
        setClients(data as unknown as Client[]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyToClipboard = (id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const result = await createClient({ name, email });
    if (result.success) {
      setName("");
      setEmail("");
      setOpen(false);
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined" && confirm("Records terminate kar dein?")) {
      const result = await deleteClient(id);
      if (result.success) loadData();
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <RefreshCw className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    // <div className="space-y-8 p-6 lg:p-10 min-h-screen bg-black text-white transition-all duration-500">
      <div className="space-y-8 py-10 pr-10 pl-4 lg:pl-6 min-h-screen bg-black text-white transition-all duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <h2 className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase">Database Connectivity</h2>
             {isSyncing ? (
               <RefreshCw size={12} className="animate-spin text-emerald-400" />
             ) : (
               <CheckCircle2 size={12} className="text-emerald-400" />
             )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Clients <span className="italic">Registry</span></h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          {/* ✅ FIXED 1: No asChild here, direct styling to Trigger */}
          <DialogTrigger className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer">
            <Plus size={20} className="mr-2" /> Register New Client
          </DialogTrigger>
          
          <DialogContent className="bg-[#111] border-white/10 text-white rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <Input 
                className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-2 focus:ring-blue-500 text-white" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Client Name" 
                required 
              />
              <Input 
                className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:ring-2 focus:ring-blue-500 text-white" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="Email Address" 
                required 
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-white text-lg transition-all shadow-xl shadow-blue-600/30">
                Sync to Database
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#0a0a0a] border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Client Identity</TableHead>
              <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Digital Address</TableHead>
              <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">System ID (UUID)</TableHead>
              <TableHead className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center text-slate-500 italic">No clients found in the registry.</TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="border-white/5 hover:bg-white/[0.02] transition-all group">
                  <TableCell className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-black">
                        {client.name?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <span className="font-bold text-lg capitalize">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-8 text-slate-400 font-medium text-lg">{client.email}</TableCell>
                  
                  <TableCell className="p-8">
                    <button 
                      type="button"
                      onClick={() => copyToClipboard(client.id)}
                      className="flex items-center gap-2 font-mono text-[10px] text-blue-500/70 hover:text-blue-400 transition-colors bg-blue-500/5 px-3 py-2 rounded-lg border border-blue-500/10 cursor-pointer"
                    >
                      {copiedId === client.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      {client.id}
                    </button>
                  </TableCell>

                  <TableCell className="text-right p-8">
                    <DropdownMenu>
                      {/* ✅ FIXED 2: asChild removed from DropdownMenuTrigger too */}
                      <DropdownMenuTrigger className="h-12 w-12 flex items-center justify-center text-slate-500 hover:text-white rounded-xl hover:bg-white/10 transition-all outline-none">
                        <MoreHorizontal size={24} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white rounded-2xl p-2 shadow-2xl">
                        <DropdownMenuItem 
                          onClick={() => handleDelete(client.id)} 
                          className="text-red-500 cursor-pointer focus:bg-red-500/10 font-black p-4 rounded-xl flex items-center gap-3"
                        >
                          <Trash size={18} /> Terminate Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}