"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'idle' });
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await submitContactForm(formData);
      
      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors);
        } else if (result.message) {
          setStatus({ type: 'error', message: result.message });
        }
      } else {
        setStatus({ type: 'success', message: result.message });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
          >
            <MessageSquare className="w-4 h-4" />
            Support & Sales
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Get in <span className="gradient-text-emerald">touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-400 leading-relaxed"
          >
            Have a question about TradeX? Want to learn about Enterprise plans? We would love to hear from you.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Contact Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div className="glass border border-white/[0.08] rounded-3xl p-8 hover:border-emerald-500/30 transition-colors duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Chat with us</h3>
              <p className="text-neutral-400 mb-6">Our friendly team is here to help.</p>
              <a href="mailto:support@tradex.com" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                support@tradex.com
              </a>
            </div>

            <div className="glass border border-white/[0.08] rounded-3xl p-8 hover:border-indigo-500/30 transition-colors duration-300">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <MapPin className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visit us</h3>
              <p className="text-neutral-400 mb-6">Come say hello at our office HQ.</p>
              <address className="not-italic text-white font-medium">
                100 Innovation Way<br />
                San Francisco, CA 94105
              </address>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3 glass border border-white/[0.08] rounded-3xl p-8 sm:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] pointer-events-none" />
            
            <form className="relative z-10 flex flex-col gap-6" onSubmit={handleSubmit}>
              
              {status.type === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-400 font-medium">{status.message}</p>
                </div>
              )}

              {status.type === 'error' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-400 font-medium">{status.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-neutral-300">First name</label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    disabled={isPending}
                    placeholder="John" 
                    className="bg-white/[0.03] border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 rounded-xl" 
                  />
                  {errors?.firstName && <p className="text-xs text-rose-400 mt-1">{errors.firstName[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-neutral-300">Last name</label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    disabled={isPending}
                    placeholder="Doe" 
                    className="bg-white/[0.03] border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 rounded-xl" 
                  />
                  {errors?.lastName && <p className="text-xs text-rose-400 mt-1">{errors.lastName[0]}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email</label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  disabled={isPending}
                  placeholder="john@company.com" 
                  className="bg-white/[0.03] border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 rounded-xl" 
                />
                {errors?.email && <p className="text-xs text-rose-400 mt-1">{errors.email[0]}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-neutral-300">Message</label>
                <Textarea 
                  id="message" 
                  name="message"
                  disabled={isPending}
                  placeholder="How can we help?" 
                  className="bg-white/[0.03] border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 min-h-[150px] rounded-xl resize-none" 
                />
                {errors?.message && <p className="text-xs text-rose-400 mt-1">{errors.message[0]}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-12 rounded-xl mt-4 group transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
