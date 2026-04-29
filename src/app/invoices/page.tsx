"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Loader2, Plus, Receipt, CheckCircle2, Clock } from "lucide-react";
// 1. updateInvoiceStatus action ko import mein add kiya
import { createInvoice, getAllClients, getInvoices, updateInvoiceStatus } from "@/actions/invoices"; 

export default function InvoicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States
  const [clients, setClients] = useState<any[]>([]); 
  const [invoices, setInvoices] = useState<any[]>([]); 
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");

  // 2. Data load karne ka function
  const loadInitialData = async () => {
    const [clientsRes, invoicesRes] = await Promise.all([
      getAllClients(),
      getInvoices()
    ]);
    
    if (clientsRes.success) setClients(clientsRes.clients);
    if (invoicesRes.success) setInvoices(invoicesRes.invoices);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // 3. Status Toggle karne ka Handler
  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const res = await updateInvoiceStatus(id, currentStatus);
    if (res.success) {
      // Local state refresh karein taake UI foran update ho
      const updated = await getInvoices();
      if (updated.success) setInvoices(updated.invoices);
    } else {
      alert("Failed to update status.");
    }
  };

  const handleCommitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !amount) return alert("Please select a client and enter amount");

    setIsSubmitting(true);
    try {
      const result = await createInvoice({
        clientId: clientId,
        amount: parseFloat(amount),
      });

      if (result.success) {
        setIsModalOpen(false);
        setClientId("");
        setAmount("");
        const updatedInvoices = await getInvoices();
        if (updatedInvoices.success) setInvoices(updatedInvoices.invoices);
        alert("Invoice Committed Successfully!");
      } else {
        alert(result.error || "Failed to create invoice.");
      }
    } catch (err) {
      console.error("Invoice Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6 md:p-10 relative font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-blue-500 text-[10px] font-black tracking-widest uppercase mb-2">Financial Records</p>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Manage <span className="text-blue-500">Invoices</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 px-8 py-4 rounded-2xl font-black italic text-sm hover:scale-105 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> NEW INVOICE
        </button>
      </div>

      {/* Invoice List Area */}
      <div className="grid gap-4">
        {invoices.length === 0 ? (
          <div className="bg-[#151B2D] rounded-[2.5rem] border border-white/5 p-20 text-center shadow-2xl">
            <Receipt size={48} className="mx-auto mb-4 opacity-10" />
            <p className="opacity-20 italic font-black uppercase tracking-widest text-sm">
              Select "New Invoice" to begin documentation
            </p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="bg-[#151B2D] border border-white/5 p-6 rounded-4xl flex items-center justify-between hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-black italic uppercase text-lg tracking-tight">
                    {invoice.client?.name || "Unknown Client"}
                  </h3>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    ID: {invoice.id.slice(-8)} • {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-2xl font-black italic text-white">${invoice.amount.toFixed(2)}</p>
                </div>

                {/* 4. Clickable Status Button */}
                <button
                  onClick={() => handleStatusToggle(invoice.id, invoice.status)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 border transition-all active:scale-95 ${
                    invoice.status === "PAID" 
                      ? "bg-green-500/10 text-green-500 border-green-500/20" 
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}
                >
                  {invoice.status === "PAID" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {invoice.status}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL Code (Aapka existing modal yahan rahega) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
          <div className="bg-[#111625] border border-white/5 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-8 top-8 text-white/40 hover:text-white transition-colors hover:rotate-90 duration-300"
            >
              <X size={28} />
            </button>

            <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tight">
              Generate <span className="text-blue-500">Invoice</span>
            </h2>

            <form onSubmit={handleCommitInvoice} className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-3 block">
                  Select Client
                </label>
                <select 
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full bg-[#1A202E] border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-white font-medium cursor-pointer"
                >
                  <option value="">Choose from registry...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id} className="bg-[#111625]">
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] mb-3 block">
                  Transaction Amount ($)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#1A202E] border border-white/5 p-8 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-4xl font-black text-white placeholder:opacity-5"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 p-5 rounded-3xl font-black uppercase italic text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Commit Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}