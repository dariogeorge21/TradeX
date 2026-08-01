"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type MutualFundWatchlistItem = {
  id: string;
  user_id: string;
  fund_code: string;
  fund_name: string;
  amc?: string | null;
  category?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
};

export async function addMutualFundToWatchlist(fund: {
  fund_code: string;
  fund_name: string;
  amc?: string;
  category?: string;
  logo_url?: string;
}) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("mutual_fund_watchlists").insert([
    {
      user_id: userData.user.id,
      fund_code: fund.fund_code.toUpperCase(),
      fund_name: fund.fund_name,
      amc: fund.amc || null,
      category: fund.category || null,
      logo_url: fund.logo_url || null,
    },
  ]);

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      return { success: true, message: "Already in watchlist" };
    }
    console.error("Error adding mutual fund to watchlist:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/mutual-funds/watchlist");
  revalidatePath(`/dashboard/mutual-funds/${fund.fund_code}`);
  return { success: true };
}

export async function removeMutualFundFromWatchlist(fundCode: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("mutual_fund_watchlists")
    .delete()
    .eq("user_id", userData.user.id)
    .eq("fund_code", fundCode.toUpperCase());

  if (error) {
    console.error("Error removing mutual fund from watchlist:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/mutual-funds/watchlist");
  revalidatePath(`/dashboard/mutual-funds/${fundCode}`);
  return { success: true };
}

export async function toggleMutualFundWatchlist(fund: {
  fund_code: string;
  fund_name: string;
  amc?: string;
  category?: string;
  logo_url?: string;
}) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = userData.user.id;
  const upperCode = fund.fund_code.toUpperCase();

  // Check if exists
  const { data: existing, error: checkError } = await supabase
    .from("mutual_fund_watchlists")
    .select("id")
    .eq("user_id", userId)
    .eq("fund_code", upperCode)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking mutual fund watchlist:", checkError);
    return { success: false, error: checkError.message };
  }

  if (existing) {
    // Remove
    const { error: deleteError } = await supabase
      .from("mutual_fund_watchlists")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      console.error("Error removing mutual fund from watchlist:", deleteError);
      return { success: false, error: deleteError.message };
    }
    revalidatePath("/dashboard/mutual-funds/watchlist");
    revalidatePath(`/dashboard/mutual-funds/${upperCode}`);
    return { success: true, action: "removed" };
  } else {
    // Add
    const { error: insertError } = await supabase
      .from("mutual_fund_watchlists")
      .insert([
        {
          user_id: userId,
          fund_code: upperCode,
          fund_name: fund.fund_name,
          amc: fund.amc || null,
          category: fund.category || null,
          logo_url: fund.logo_url || null,
        },
      ]);

    if (insertError) {
      console.error("Error adding mutual fund to watchlist:", insertError);
      return { success: false, error: insertError.message };
    }
    revalidatePath("/dashboard/mutual-funds/watchlist");
    revalidatePath(`/dashboard/mutual-funds/${upperCode}`);
    return { success: true, action: "added" };
  }
}

export async function getMutualFundWatchlist() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated", data: [] };
  }

  const { data, error } = await supabase
    .from("mutual_fund_watchlists")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mutual fund watchlist:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as MutualFundWatchlistItem[] };
}

export async function getMutualFundWatchlistCount() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated", count: 0 };
  }

  const { count, error } = await supabase
    .from("mutual_fund_watchlists")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Error fetching mutual fund watchlist count:", error);
    return { success: false, error: error.message, count: 0 };
  }

  return { success: true, count: count || 0 };
}

export async function searchMutualFundWatchlist(query: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated", data: [] };
  }

  const { data, error } = await supabase
    .from("mutual_fund_watchlists")
    .select("*")
    .eq("user_id", userData.user.id)
    .or(`fund_name.ilike.%${query}%,fund_code.ilike.%${query}%,amc.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching mutual fund watchlist:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data as MutualFundWatchlistItem[] };
}
