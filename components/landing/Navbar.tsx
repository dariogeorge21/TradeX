"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Lock body scroll and handle escape key
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileOpen(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/40"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsMobileOpen(false)}>
                <div className="relative w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/60 transition-colors duration-300 p-1">
                  <Image
                    src="/logo.png"
                    alt="TradeX Logo"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse-glow pointer-events-none" />
                </div>
                <span className="font-bold text-lg tracking-tight">
                  <span className="text-white">Trade</span>
                  <span className="gradient-text-emerald">X</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-neutral-400 hover:text-white hover:bg-white/5"
                })}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({
                  size: "sm",
                  className: "relative bg-emerald-500 hover:bg-emerald-400 text-black font-semibold overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                })}
              >
                <span className="flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  Get Started
                </span>
                <div className="absolute inset-0 animate-shimmer" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={isMobileOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: isMobileOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isMobileOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-white/[0.08] md:hidden shadow-2xl h-[calc(100vh-4rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
              <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="px-4 py-3 text-base text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium flex items-center justify-between group"
                  >
                    {link.label}
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &rarr;
                    </motion.span>
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/[0.06]">
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full text-base border-white/10 justify-center"
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileOpen(false)}
                  className={buttonVariants({
                    size: "lg",
                    className: "w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-base justify-center"
                  })}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
