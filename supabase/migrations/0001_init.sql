create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  credits integer not null default 10 check (credits >= 0),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "read_own_profile"
on public.users
for select
using (auth.uid() = id);

create policy "update_own_profile"
on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, credits)
  values (new.id, 10)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.consume_credit(user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  update public.users
     set credits = credits - 1
   where id = user_id
     and credits > 0
  returning credits into remaining;

  if remaining is null then
    raise exception 'insufficient_credits';
  end if;

  return remaining;
end;
$$;

grant execute on function public.consume_credit(uuid) to authenticated, service_role;
