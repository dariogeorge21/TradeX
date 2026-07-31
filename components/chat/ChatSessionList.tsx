"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export function ChatSessionList({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatSessionListProps) {
  return (
    <aside className="chat-sidebar" aria-label="Chat history">
      {/* New Chat button */}
      <div className="chat-sidebar-header">
        <span className="chat-sidebar-title">Conversations</span>
        <button
          id="new-chat-btn"
          onClick={onNewChat}
          className="chat-new-btn"
          aria-label="Start new chat"
          title="New Chat"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Session list */}
      <nav className="chat-session-list" aria-label="Previous conversations">
        {sessions.length === 0 && (
          <div className="chat-session-empty">
            <MessageSquare size={20} className="chat-session-empty-icon" />
            <p>No conversations yet</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className={`chat-session-item ${isActive ? "chat-session-item--active" : ""}`}
              >
                <button
                  className="chat-session-btn"
                  onClick={() => onSelectSession(session.id)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Open conversation: ${session.title}`}
                >
                  <MessageSquare size={14} className="chat-session-icon" />
                  <div className="chat-session-info">
                    <span className="chat-session-title">{session.title}</span>
                    <span className="chat-session-time">
                      <Clock size={10} />
                      {formatDistanceToNow(new Date(session.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </button>

                {/* Delete button */}
                <button
                  className="chat-session-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  aria-label={`Delete conversation: ${session.title}`}
                  title="Delete conversation"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>
    </aside>
  );
}
