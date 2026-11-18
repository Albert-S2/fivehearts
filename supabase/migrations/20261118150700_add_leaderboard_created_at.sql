alter table public.leaderboard
  add column if not exists created_at timestamptz not null default now();

notify pgrst, 'reload schema';
