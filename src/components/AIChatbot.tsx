"use client";
import { useState } from "react";
import { MessageSquare, Send, X, Bot } from "lucide-react";
// 1. getChatResponse ko import karna zaroori hai
import { getChatResponse } from "@/actions/chat"; 

export default function AIChatbot() {
  // 2. Variables ko component ke ANDAR hona chahiye
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi Ayesha! How can I help with your freelance projects?" }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input };
    // TypeScript 'any' error fix karne ke liye prev ka use
    setMessages((prev: any) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    try {
      const responseText = await getChatResponse(currentInput);
      const aiMsg = { role: "assistant", content: responseText };
      setMessages((prev: any) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 p-4 rounded-full shadow-lg hover:scale-110 transition-all text-white"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-[#0f1115] border border-white/10 rounded-4xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-blue-600 text-white flex items-center gap-2">
            <Bot size={20} />
            <span className="font-bold text-sm">AI Assistant</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m: any, i: number) => (
              <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'}`}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-white text-xs"
            />
            <button onClick={sendMessage} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}