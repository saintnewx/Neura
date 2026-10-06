-- Neura / supabase-copper-marble
-- Выполните весь файл в Supabase SQL Editor. Повторный запуск безопасен.
-- Секретный service-role ключ не требуется ни браузеру, ни Vercel-функции.
begin;

-- Профиль создаётся вместе с auth.users; квота считается по календарным дням UTC.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  generations_today integer not null default 0 check (generations_today >= 0),
  last_reset_date date not null default (timezone('utc', now()))::date
);

-- Совместимость с ранее созданной минимальной таблицей profiles.
alter table public.profiles
  add column if not exists generations_today integer not null default 0
    check (generations_today >= 0),
  add column if not exists last_reset_date date not null
    default (timezone('utc', now()))::date;

-- История генераций принадлежит пользователю и удаляется вместе с его профилем.
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  task text not null,
  type text not null,
  tone text not null default 'Нейтральный',
  result text not null,
  created_at timestamptz not null default now()
);

create index if not exists generations_user_created_at_idx
  on public.generations (user_id, created_at desc);

-- Клиент не может менять plan, счётчики или чужую историю.
alter table public.profiles enable row level security;
alter table public.generations enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.generations from anon, authenticated;
grant select on table public.profiles to authenticated;
grant select, insert on table public.generations to authenticated;

-- Эти две таблицы управляются Neura. Удаляем старые политики, чтобы более
-- широкая permissive-политика не открыла чужие записи после повторного запуска.
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_catalog.pg_policies
    where schemaname = 'public' and tablename in ('profiles', 'generations')
  loop
    execute format(
      'drop policy %I on %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  end loop;
end;
$$;

create policy profiles_select_own
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy generations_select_own
  on public.generations for select to authenticated
  using ((select auth.uid()) = user_id);

create policy generations_insert_own
  on public.generations for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- auth.uid() здесь не используется: auth-триггер получает пользователя из NEW,
-- в том числе при регистрации Google и создании учётной записи через Dashboard.
create or replace function public.sync_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

revoke all on function public.sync_auth_user_profile()
  from public, anon, authenticated;

drop trigger if exists neura_auth_user_profile on auth.users;
create trigger neura_auth_user_profile
  after insert or update of email on auth.users
  for each row execute function public.sync_auth_user_profile();

-- Подключение схемы после первых регистраций тоже создаёт нужные профили.
insert into public.profiles (id, email, created_at)
select id, email, created_at from auth.users
on conflict (id) do update set email = excluded.email;

-- Чтение квоты также атомарно сбрасывает счётчик при смене дня UTC.
create or replace function public.get_daily_usage()
returns table (used integer, "limit" integer, reset_date date)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  today_utc date := (timezone('utc', now()))::date;
  profile_usage integer;
  profile_reset_date date;
begin
  if current_user_id is null then
    raise exception 'Для просмотра лимита необходимо войти.'
      using errcode = '42501';
  end if;

  select p.generations_today, p.last_reset_date
    into profile_usage, profile_reset_date
  from public.profiles p
  where p.id = current_user_id
  for update;

  if not found then
    raise exception 'Профиль не найден. Выполните supabase/schema.sql.'
      using errcode = 'P0002';
  end if;

  if profile_reset_date is distinct from today_utc then
    update public.profiles
    set generations_today = 0, last_reset_date = today_utc
    where id = current_user_id;
    profile_usage := 0;
  end if;

  return query select profile_usage, 20, today_utc;
end;
$$;

-- Vercel вызывает RPC с Bearer-токеном пользователя ДО запроса к NVIDIA.
-- Одна попытка расходует один слот, включая неуспешный запрос к NVIDIA.
-- Блокировка строки защищает лимит 20 от одновременных запросов и разных вкладок.
create or replace function public.reserve_generation()
returns table (allowed boolean, used integer, "limit" integer, reset_date date)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  today_utc date := (timezone('utc', now()))::date;
  profile_usage integer;
  profile_reset_date date;
begin
  if current_user_id is null then
    raise exception 'Для резервирования генерации необходимо войти.'
      using errcode = '42501';
  end if;

  select p.generations_today, p.last_reset_date
    into profile_usage, profile_reset_date
  from public.profiles p
  where p.id = current_user_id
  for update;

  if not found then
    raise exception 'Профиль не найден. Выполните supabase/schema.sql.'
      using errcode = 'P0002';
  end if;

  if profile_reset_date is distinct from today_utc then
    update public.profiles
    set generations_today = 0, last_reset_date = today_utc
    where id = current_user_id;
    profile_usage := 0;
  end if;

  if profile_usage >= 20 then
    return query select false, profile_usage, 20, today_utc;
    return;
  end if;

  update public.profiles
  set generations_today = generations_today + 1
  where id = current_user_id
  returning generations_today into profile_usage;

  return query select true, profile_usage, 20, today_utc;
end;
$$;

-- SECURITY DEFINER-функции открыты только аутентифицированным пользователям.
-- Пользователь не задаёт user_id или размер лимита: оба определяются на сервере.
revoke all on function public.get_daily_usage() from public, anon, authenticated;
revoke all on function public.reserve_generation() from public, anon, authenticated;
grant execute on function public.get_daily_usage() to authenticated;
grant execute on function public.reserve_generation() to authenticated;

commit;
