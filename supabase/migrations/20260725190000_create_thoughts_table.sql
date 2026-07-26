create table if not exists public.thoughts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  negative text not null,
  positive text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.thoughts enable row level security;

drop policy if exists "Users can manage their own thoughts" on public.thoughts;
create policy "Users can manage their own thoughts"
  on public.thoughts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
