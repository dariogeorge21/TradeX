-- =============================================================================
-- TradeX — Watchlists Migration
-- File: supabase/migrations/20260801_create_watchlists.sql
-- =============================================================================

-- 1. Create watchlists table
create table if not exists public.watchlists (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    symbol text not null,
    asset_type text default 'stock',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, symbol)
);

comment on table public.watchlists is 'Stores user watchlists for stocks and other assets.';

-- 2. Enable RLS
alter table public.watchlists enable row level security;

-- 3. RLS Policies
create policy "Users can view their own watchlists"
on public.watchlists
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own watchlists"
on public.watchlists
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own watchlists"
on public.watchlists
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own watchlists"
on public.watchlists
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 4. Indexes
create index if not exists watchlists_user_id_idx on public.watchlists(user_id);
create index if not exists watchlists_symbol_idx on public.watchlists(symbol);

-- 5. Trigger for updated_at
create or replace function public.handle_watchlists_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists on_watchlists_updated on public.watchlists;
create trigger on_watchlists_updated
    before update on public.watchlists
    for each row execute procedure public.handle_watchlists_updated_at();

-- 6. Grant access to authenticated role
grant select, insert, update, delete on public.watchlists to authenticated;
