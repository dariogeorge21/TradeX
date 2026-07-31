"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, TrendingUp, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass border-b border-white/[0.06] shadow-2xl shadow-black/20"
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
              <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-500/60 transition-colors duration-300">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <div className="absolute inset-0 rounded-xl bg-emerald-500/5 animate-pulse-glow" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-white">Trade</span>
                <span className="gradient-text-emerald">X</span>
              </span>
              </Link>
            </motion.div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
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
              className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Toggle mobile menu"
              id="mobile-menu-toggle"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-white/[0.06] md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="px-4 py-3 text-sm text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex-1 text-sm border-white/10"
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileOpen(false)}
                  className={buttonVariants({
                    size: "sm",
                    className: "flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm"
                  })}
                >
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
