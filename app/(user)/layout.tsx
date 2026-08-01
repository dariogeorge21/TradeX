import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Viewport } from "next";
import { createClient } from "@/utils/supabase/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Derive display name and avatar from user metadata
  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Trader";

  const avatarUrl =
    user.user_metadata?.avatar_url ??
    user.user_metadata?.picture ??
    null;

  // Read persisted sidebar state from cookie (set by SidebarProvider)
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultSidebarOpen = sidebarCookie ? sidebarCookie.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <DashboardSidebar />
      <div className="dashboard-shell">
        <DashboardTopBar displayName={displayName} avatarUrl={avatarUrl} />
        <main id="main-content" className="dashboard-content relative" tabIndex={-1}>
          {children}
          <FloatingAIAssistant />
        </main>
      </div>
    </SidebarProvider>
  );
}
