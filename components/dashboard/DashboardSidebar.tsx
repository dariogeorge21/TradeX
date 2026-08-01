"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, Newspaper, LineChart, MessageSquare, PieChart, Loader2, Bitcoin, DollarSign, Activity, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/app/actions/auth";

// ---------------------------------------------------------------------------
// Nav items - extend this array to add future pages
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Stocks",
    href: "/dashboard/stocks",
    icon: LineChart,
  },
  {
    label: "Mutual Funds",
    href: "/dashboard/mutual-funds",
    icon: PieChart,
  },
  {
    label: "Crypto",
    href: "/dashboard/crypto",
    icon: Bitcoin,
  },
  {
    label: "Forex",
    href: "/dashboard/forex",
    icon: DollarSign,
  },
  {
    label: "Currency Converter",
    href: "/dashboard/currency-converter",
    icon: ArrowRightLeft,
  },
  {
    label: "Market Indicators",
    href: "/dashboard/indicators",
    icon: Activity,
  },
  {
    label: "News",
    href: "/dashboard/news",
    icon: Newspaper,
  },
  {
    label: "AI Chat",
    href: "/dashboard/chatbot",
    icon: MessageSquare,
  },
] as const;

// ---------------------------------------------------------------------------
// TradeX Logo Mark
// ---------------------------------------------------------------------------
function TradeXLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="sidebar-logo-wrap" aria-label="TradeX">
      <div className="sidebar-logo-icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none" width={28} height={28}>
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
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            className="sidebar-logo-wordmark"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            TradeX
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Sidebar Component
// ---------------------------------------------------------------------------
export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [loadingHref, setLoadingHref] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" className="sidebar-custom">
      {/* Header */}
      <SidebarHeader className="sidebar-header-custom">
        <div className="sidebar-header-row">
          <TradeXLogo collapsed={isCollapsed} />
          <SidebarTrigger className="sidebar-trigger-btn" />
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(href);
                const isLoading = loadingHref === href;

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      render={
                        <Link
                          href={href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => {
                            if (!isActive) {
                              setLoadingHref(href);
                            }
                          }}
                        />
                      }
                      className={
                        isActive
                          ? "sidebar-nav-item sidebar-nav-item--active"
                          : "sidebar-nav-item"
                      }
                    >
                      {isLoading ? (
                        <Loader2
                          className="sidebar-nav-icon animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Icon
                          className="sidebar-nav-icon"
                          aria-hidden="true"
                        />
                      )}
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Sign Out */}
      <SidebarFooter className="sidebar-footer-custom">
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut} className="w-full">
              <SidebarMenuButton
                tooltip="Sign Out"
                render={<button type="submit" aria-label="Sign out of TradeX" className="w-full" />}
                className="sidebar-nav-item sidebar-signout-item"
              >
                <LogOut
                  className="sidebar-nav-icon sidebar-signout-icon"
                  aria-hidden="true"
                />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
