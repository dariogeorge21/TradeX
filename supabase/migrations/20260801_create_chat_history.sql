-- =============================================================================
-- TradeX — Chat History Migration
-- File: supabase/migrations/20260801_create_chat_history.sql
--
-- PURPOSE:
--   Creates two tables to support the AI Financial Chatbot feature:
--     • public.chat_sessions  — one row per conversation thread per user
--     • public.chat_messages  — individual messages within a session
--
--   Row Level Security (RLS) is enabled on both tables so users can only
--   access their own data. Indexes are added for common query patterns.
--
-- HOW TO RUN:
--   Paste this file into the Supabase Dashboard → SQL Editor → Run
--   Or execute via: supabase db query --file supabase/migrations/20260801_create_chat_history.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. chat_sessions — one row per conversation thread
-- ---------------------------------------------------------------------------
create table if not exists public.chat_sessions (
  id          uuid        not null default gen_random_uuid() primary key,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  title       text        not null default 'New Conversation',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.chat_sessions is
  'Each row represents one AI chat conversation thread belonging to a user.';

comment on column public.chat_sessions.title is
  'Derived from the first user message (truncated to 80 chars) for display in history.';

-- ---------------------------------------------------------------------------
-- 2. chat_messages — individual messages within a session
-- ---------------------------------------------------------------------------
create table if not exists public.chat_messages (
  id          uuid        not null default gen_random_uuid() primary key,
  session_id  uuid        not null references public.chat_sessions(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null,
  created_at  timestamptz not null default now()
);

comment on table public.chat_messages is
  'Individual chat messages (user or assistant) belonging to a chat_session.';

-- ---------------------------------------------------------------------------
-- 3. Indexes for common query patterns
-- ---------------------------------------------------------------------------

-- Fast lookup of all sessions for a user (history sidebar)
create index if not exists chat_sessions_user_id_updated_at_idx
  on public.chat_sessions (user_id, updated_at desc);

-- Fast lookup of all messages in a session (ordered by time)
create index if not exists chat_messages_session_id_created_at_idx
  on public.chat_messages (session_id, created_at asc);

-- Index to quickly enforce user ownership during RLS checks
create index if not exists chat_messages_user_id_idx
  on public.chat_messages (user_id);

-- ---------------------------------------------------------------------------
-- 4. Enable Row Level Security
-- ---------------------------------------------------------------------------
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- ---------------------------------------------------------------------------
-- 5. RLS Policies — chat_sessions
-- ---------------------------------------------------------------------------

-- Users can view only their own sessions
create policy "Users can select own chat sessions"
  on public.chat_sessions
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Users can insert their own sessions
create policy "Users can insert own chat sessions"
  on public.chat_sessions
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

-- Users can update their own sessions (e.g. title, updated_at)
create policy "Users can update own chat sessions"
  on public.chat_sessions
  for update
  to authenticated
  using  ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- Users can delete their own sessions (cascades to messages)
create policy "Users can delete own chat sessions"
  on public.chat_sessions
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

-- ---------------------------------------------------------------------------
-- 6. RLS Policies — chat_messages
-- ---------------------------------------------------------------------------

-- Users can view only messages belonging to their own sessions
create policy "Users can select own chat messages"
  on public.chat_messages
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- Users can insert messages into their own sessions
create policy "Users can insert own chat messages"
  on public.chat_messages
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

-- Users can delete their own messages
create policy "Users can delete own chat messages"
  on public.chat_messages
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );

-- ---------------------------------------------------------------------------
-- 7. Trigger: auto-update chat_sessions.updated_at on new message
-- ---------------------------------------------------------------------------
create or replace function public.update_chat_session_timestamp()
returns trigger
language plpgsql
security invoker set search_path = ''
as $$
begin
  update public.chat_sessions
  set updated_at = now()
  where id = new.session_id;
  return new;
end;
$$;

drop trigger if exists on_chat_message_inserted on public.chat_messages;
create trigger on_chat_message_inserted
  after insert on public.chat_messages
  for each row execute procedure public.update_chat_session_timestamp();

-- ---------------------------------------------------------------------------
-- 8. Grant explicit access to the authenticated role
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.chat_sessions to authenticated;
grant select, insert, delete on public.chat_messages to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Optional: enable Realtime for live session list updates
-- (Uncomment if you want the sidebar to update in real-time across tabs)
-- ---------------------------------------------------------------------------
-- alter publication supabase_realtime add table public.chat_sessions;
