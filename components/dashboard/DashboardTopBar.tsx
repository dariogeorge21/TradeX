"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { signOut } from "@/app/actions/auth";
import { GlobalCommandPalette } from "./GlobalCommandPalette";

interface DashboardTopBarProps {
  displayName: string;
  avatarUrl: string | null;
}

export function DashboardTopBar({ displayName, avatarUrl }: DashboardTopBarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="topbar" role="banner">
      {/* Left: sidebar trigger (visible on mobile; hidden on desktop when sidebar is expanded) */}
      <div className="topbar-left">
        <motion.div
          animate={{ opacity: isCollapsed ? 1 : 0, pointerEvents: isCollapsed ? "auto" : "none" }}
          transition={{ duration: 0.15 }}
          className="topbar-trigger-wrap"
          aria-hidden={!isCollapsed}
        >
          <SidebarTrigger className="topbar-trigger-btn" />
        </motion.div>

        {/* Mobile trigger - always visible on small screens */}
        <div className="topbar-trigger-mobile">
          <SidebarTrigger className="topbar-trigger-btn" />
        </div>

        <Link
          href="/dashboard"
          className="topbar-brand"
          aria-label="TradeX dashboard home"
        >
          <svg viewBox="0 0 40 40" fill="none" width={22} height={22} aria-hidden="true">
            <rect
              width="40"
              height="40"
              rx="10"
              fill="oklch(0.70 0.18 162)"
              fillOpacity="0.15"
            />
            <path
              d="M8 28L16 16L22 22L28 12L32 16"
              stroke="oklch(0.70 0.18 162)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="12" r="3" fill="oklch(0.70 0.18 162)" />
          </svg>
          <span className="topbar-brand-text">TradeX</span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <GlobalCommandPalette />
      </div>

      {/* Right: user info + sign out */}
      <div className="topbar-right">
        {/* User identity */}
        <div className="topbar-user" aria-label={`Signed in as ${displayName}`}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={`${displayName} avatar`}
              className="topbar-avatar"
              width={32}
              height={32}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="topbar-avatar topbar-avatar--initials" aria-hidden="true">
              {initials}
            </div>
          )}
          <span className="topbar-username">{displayName}</span>
        </div>

        {/* Sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="topbar-signout-btn"
            aria-label="Sign out of TradeX"
          >
            <LogOut size={15} aria-hidden="true" />
            <span className="topbar-signout-label">Sign Out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
