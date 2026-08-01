"use server";

import { createClient } from "@/utils/supabase/server";
import { AssetType } from "@/types/watchlist";
import { revalidatePath } from "next/cache";

export async function addToWatchlist(symbol: string, assetType: AssetType = "stock") {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("watchlists")
    .insert([
      {
        user_id: userData.user.id,
        symbol: symbol.toUpperCase(),
        asset_type: assetType,
      },
    ]);

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { success: true, message: "Already in watchlist" };
    }
    console.error("Error adding to watchlist:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/watchlist");
  return { success: true };
}

export async function removeFromWatchlist(symbol: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("user_id", userData.user.id)
    .eq("symbol", symbol.toUpperCase());

  if (error) {
    console.error("Error removing from watchlist:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/watchlist");
  return { success: true };
}

export async function toggleWatchlist(symbol: string, assetType: AssetType = "stock") {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = userData.user.id;
  const upperSymbol = symbol.toUpperCase();

  // Check if exists
  const { data: existing, error: checkError } = await supabase
    .from("watchlists")
    .select("id")
    .eq("user_id", userId)
    .eq("symbol", upperSymbol)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is not found
    console.error("Error checking watchlist:", checkError);
    return { success: false, error: checkError.message };
  }

  if (existing) {
    // Remove
    const { error: deleteError } = await supabase
      .from("watchlists")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      console.error("Error removing from watchlist:", deleteError);
      return { success: false, error: deleteError.message };
    }
    revalidatePath("/dashboard/watchlist");
    return { success: true, action: "removed" };
  } else {
    // Add
    const { error: insertError } = await supabase
      .from("watchlists")
      .insert([
        {
          user_id: userId,
          symbol: upperSymbol,
          asset_type: assetType,
        },
      ]);

    if (insertError) {
      console.error("Error adding to watchlist:", insertError);
      return { success: false, error: insertError.message };
    }
    revalidatePath("/dashboard/watchlist");
    return { success: true, action: "added" };
  }
}

export async function getWatchlist(assetType?: AssetType) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated", data: [] };
  }

  let query = supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (assetType) {
    query = query.eq("asset_type", assetType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching watchlist:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data };
}

export async function getWatchlistCount() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, error: "Not authenticated", count: 0 };
  }

  const { count, error } = await supabase
    .from("watchlists")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Error fetching watchlist count:", error);
    return { success: false, error: error.message, count: 0 };
  }

  return { success: true, count: count || 0 };
}
