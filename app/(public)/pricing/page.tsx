"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Minus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const pricingTiers = [
  {
    name: "Basic",
    description: "Perfect for beginners getting started with market analysis.",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "Access to basic stock data",
      "5 AI prompts per day",
      "Standard risk assessment",
      "1 Watchlist",
    ],
    notIncluded: ["Real-time data", "Market Sentiment", "Advanced Portfolio Analysis"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "Advanced AI insights for serious investors and traders.",
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      "Unlimited AI prompts",
      "Real-time market data",
      "Advanced risk & sentiment analysis",
      "Unlimited Watchlists",
      "Priority API access",
      "Early access to new features",
    ],
    notIncluded: [],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for teams and financial institutions.",
    monthlyPrice: 99,
    annualPrice: 89,
    features: [
      "Everything in Pro",
      "Custom AI model tuning",
      "API access for integration",
      "Dedicated account manager",
      "SSO & Advanced Security",
      "Custom reporting",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI aggregates data from top-tier financial APIs and processes it through advanced language models tuned for finance. While highly accurate in interpreting data, it should not be considered financial advice.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your current billing cycle.",
  },
  {
    question: "Is my portfolio data secure?",
    answer: "Absolutely. We use bank-level encryption and do not share or sell your personal financial data to third parties. Our database is secured with Supabase Row Level Security.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for your first Pro subscription payment if you are not completely satisfied.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Simple, transparent <span className="gradient-text-emerald">pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-neutral-400 leading-relaxed mb-10"
          >
            Choose the plan that best fits your investment journey. Upgrade, downgrade, or cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-white" : "text-neutral-400")}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 p-1 transition-colors hover:bg-white/20"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-emerald-500 shadow-md"
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={cn("text-sm font-medium transition-colors flex items-center gap-2", isAnnual ? "text-white" : "text-neutral-400")}>
              Annually <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Save 20%</span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className={cn(
                "relative rounded-3xl p-8 flex flex-col glass border transition-all duration-300",
                tier.popular 
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10 scale-100 md:scale-105 z-10" 
                  : "border-white/[0.08] hover:border-white/[0.15]"
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full text-black text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-neutral-400 text-sm h-10">{tier.description}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span className="text-neutral-400">/mo</span>
                </div>
                {isAnnual && tier.annualPrice > 0 && (
                  <p className="text-sm text-emerald-400 mt-2 font-medium">
                    Billed ${tier.annualPrice * 12} yearly
                  </p>
                )}
              </div>

              <Button
                className={cn(
                  "w-full mb-8 font-semibold rounded-xl py-6 transition-all duration-300",
                  tier.popular
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-lg hover:shadow-emerald-500/25"
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {tier.cta}
              </Button>

              <div className="space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-neutral-300 text-sm">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 opacity-50">
                    <Minus className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-500 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-400">Everything you need to know about the product and billing.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass border border-white/[0.08] rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="font-semibold text-white">{question}</span>
        <div className={cn("w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300", isOpen && "rotate-45 bg-white/10")}>
          <PlusIcon className="w-4 h-4 text-neutral-400" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-neutral-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
