create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_visible boolean not null default true,
  constraint guestbook_name_length check (char_length(btrim(name)) between 1 and 30),
  constraint guestbook_message_length check (char_length(btrim(message)) between 1 and 300)
);

alter table public.guestbook_entries enable row level security;

revoke all on table public.guestbook_entries from anon, authenticated;
grant select, insert on table public.guestbook_entries to anon;
grant select, insert on table public.guestbook_entries to authenticated;
grant select, insert, update, delete on table public.guestbook_entries to service_role;

drop policy if exists "Visible guestbook entries are public" on public.guestbook_entries;
create policy "Visible guestbook entries are public"
on public.guestbook_entries
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Anyone can add a visible guestbook entry" on public.guestbook_entries;
create policy "Anyone can add a visible guestbook entry"
on public.guestbook_entries
for insert
to anon, authenticated
with check (
  is_visible = true
  and char_length(btrim(name)) between 1 and 30
  and char_length(btrim(message)) between 1 and 300
);
