-- Run this in your Supabase SQL editor once you have a project.
-- Then set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars in Vercel.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  user_agent text
);

-- The service-role key bypasses RLS, so policies aren't strictly required,
-- but enabling RLS is a good default in case anon/auth roles ever touch this.
alter table public.contact_submissions enable row level security;

-- No public read or write — the API route uses the service role only.
