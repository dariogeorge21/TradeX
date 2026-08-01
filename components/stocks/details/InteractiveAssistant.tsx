"use client";

import * as React from "react";
import { Send, Bot, Sparkles, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InteractiveAssistant({ symbol }: { symbol: string }) {
  const [messages, setMessages] = React.useState<{role: "user" | "ai", content: string}[]>([
    { role: "ai", content: `Hi! I'm TradeX AI. I can analyze ${symbol}'s financials, compare it with competitors, or summarize its latest earnings. What would you like to know?` }
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: `Based on my analysis of ${symbol}, that's an excellent question. The data suggests strong underlying fundamentals, though macroeconomic factors remain a headwind. For a detailed breakdown, please check the AI Synthesis section above.` 
      }]);
    }, 1500);
  };

  const presetPrompts = [
    "Should I invest?",
    "Summarize earnings",
    "Explain risks",
    "Intrinsic value"
  ];

  return (
    <div className="flex flex-col h-[500px] bg-card border border-foreground/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-foreground/10 bg-muted/30 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{symbol} Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>
            <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-foreground/10 bg-background">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {presetPrompts.map(prompt => (
            <button 
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full border border-foreground/10 hover:bg-muted transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form 
          className="flex gap-2 mt-2" 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        >
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask about ${symbol}...`}
            className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20"
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
