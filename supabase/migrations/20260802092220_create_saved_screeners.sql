-- Create saved_screeners table
create table if not exists public.saved_screeners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  filters jsonb not null default '{}'::jsonb,
  is_favorite boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.saved_screeners enable row level security;

-- Create policies
create policy "Users can view their own saved screeners."
  on public.saved_screeners for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved screeners."
  on public.saved_screeners for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved screeners."
  on public.saved_screeners for update
  using (auth.uid() = user_id);

create policy "Users can delete their own saved screeners."
  on public.saved_screeners for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists saved_screeners_user_id_idx on public.saved_screeners (user_id);
create index if not exists saved_screeners_is_favorite_idx on public.saved_screeners (is_favorite) where is_favorite = true;

-- Add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.saved_screeners;
create trigger set_updated_at
  before update on public.saved_screeners
  for each row
  execute procedure public.handle_updated_at();
