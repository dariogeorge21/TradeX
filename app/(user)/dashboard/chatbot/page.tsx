import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { ChatInterface } from "@/components/chat/ChatInterface";
import type { ChatSession } from "@/components/chat/ChatSessionList";

export const metadata: Metadata = {
  title: "AI Chat — TradeX",
  description:
    "Your personal financial markets AI analyst. Ask about stocks, earnings, macro economics, technical analysis and more.",
};

export default async function ChatbotPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load the user's recent chat sessions (server-side for fast initial render)
  let initialSessions: ChatSession[] = [];

  if (user) {
    const { data } = await supabase
      .from("chat_sessions")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50);

    initialSessions = (data ?? []) as ChatSession[];
  }

  return (
    <div className="chatbot-page">
      <ChatInterface
        initialSessions={initialSessions}
        userId={user?.id ?? ""}
      />
    </div>
  );
}
