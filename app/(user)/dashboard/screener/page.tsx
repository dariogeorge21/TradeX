import { Metadata } from "next";
import { ScreenerWorkspace } from "@/components/screener/ScreenerWorkspace";
import { searchStocks } from "@/app/actions/screener";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Stock Screener | TradeX",
  description: "Discover stocks with advanced AI filters and technical analysis.",
};

export default async function ScreenerPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch initial stocks to populate the screener before any search/filters
  const initialStocks = await searchStocks("", {});

  return (
    <div className="min-h-screen bg-black">
      <ScreenerWorkspace initialData={initialStocks.data || []} />
    </div>
  );
}
