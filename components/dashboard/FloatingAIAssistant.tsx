"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquare, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const prompts = [
  "What should I buy today?",
  "Summarize TSLA earnings",
  "Find undervalued tech stocks",
  "Compare AAPL vs MSFT",
];

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handlePrompt = (prompt: string) => {
    setIsOpen(false);
    if (prompt) {
      router.push(`/dashboard/chatbot?q=${encodeURIComponent(prompt)}`);
    } else {
      router.push(`/dashboard/chatbot`);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-3rem)] z-50 dash-v2-card bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(167,139,250,0.2)] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-sm tracking-tight">TradeX AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-4">
              <p className="text-xs text-muted-foreground font-medium">How can I help you analyze the markets today?</p>
              
              <div className="flex flex-col gap-2">
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePrompt(prompt)}
                    className="flex items-center justify-between text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group text-sm text-white/90"
                  >
                    <span className="truncate font-medium">{prompt}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-3 border-t border-white/10 bg-white/5">
              <button 
                onClick={() => handlePrompt("")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-lg shadow-purple-500/25"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Open Full Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full floating-assistant-btn flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl -z-10 group-hover:bg-purple-500/40 transition-colors duration-500" />
      </motion.button>
    </>
  );
}
