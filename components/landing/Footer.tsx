"use client";

import { motion } from "framer-motion";
import { TrendingUp, ExternalLink } from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "AI Chat", href: "#ai-chat" },
    { label: "Market Trends", href: "#trends" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Disclaimer", href: "#" },
  ],
};

const socialLinks = [
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { icon: FaGithub, label: "GitHub", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-background overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative my-16 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-indigo-500/10 border border-white/[0.08] rounded-2xl" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative text-center py-12 px-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to invest{" "}
              <span className="gradient-text-emerald">smarter</span>?
            </h3>
            <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">
              Join thousands of investors who use TradeX to make confident, data-driven decisions every day.
            </p>
            <a
              href="#"
              id="footer-cta"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              Start for Free
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="font-bold text-base">
                <span className="text-white">Trade</span>
                <span className="gradient-text-emerald">X</span>
              </span>
            </a>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4 max-w-[180px]">
              AI-powered market intelligence for everyone. Not a trading platform.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-neutral-500 hover:text-neutral-200 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} TradeX Technologies, Inc. All rights reserved.
          </p>
          <p className="text-[10px] text-neutral-700 text-center">
            TradeX is a market research tool, not a financial advisor. Information is for educational purposes only.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors">Privacy</a>
            <a href="#" className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors">Terms</a>
            <a href="#" className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
