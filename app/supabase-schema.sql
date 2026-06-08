-- ============================================
-- 会議室予約アプリ - Supabase Schema
-- ============================================

-- 1. rooms テーブル
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity int not null check (capacity > 0),
  floor int not null,
  emoji text not null default '🚪',
  created_at timestamptz not null default now()
);

-- 2. equipment テーブル
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  name text not null
);

-- 3. reservations テーブル
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  organizer text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  constraint valid_time check (start_time < end_time)
);

-- 4. participants テーブル
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  name text not null
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- rooms: 誰でも読める、変更は認証ユーザーのみ
alter table public.rooms enable row level security;
create policy "rooms_select" on public.rooms for select using (true);

-- equipment: 誰でも読める
alter table public.equipment enable row level security;
create policy "equipment_select" on public.equipment for select using (true);

-- reservations: 自分のデータだけ見える・操作できる
alter table public.reservations enable row level security;
create policy "reservations_select_own" on public.reservations
  for select using (auth.uid() = user_id);
create policy "reservations_insert_own" on public.reservations
  for insert with check (auth.uid() = user_id);
create policy "reservations_update_own" on public.reservations
  for update using (auth.uid() = user_id);
create policy "reservations_delete_own" on public.reservations
  for delete using (auth.uid() = user_id);

-- participants: 自分の予約のparticipantsだけ見える・操作できる
alter table public.participants enable row level security;
create policy "participants_select_own" on public.participants
  for select using (
    exists (
      select 1 from public.reservations r
      where r.id = reservation_id and r.user_id = auth.uid()
    )
  );
create policy "participants_insert_own" on public.participants
  for insert with check (
    exists (
      select 1 from public.reservations r
      where r.id = reservation_id and r.user_id = auth.uid()
    )
  );
create policy "participants_delete_own" on public.participants
  for delete using (
    exists (
      select 1 from public.reservations r
      where r.id = reservation_id and r.user_id = auth.uid()
    )
  );

-- ============================================
-- 初期データ (rooms & equipment)
-- ============================================
insert into public.rooms (id, name, capacity, floor, emoji) values
  ('11111111-1111-1111-1111-111111111111', 'さくら', 6, 3, '🌸'),
  ('22222222-2222-2222-2222-222222222222', 'ふじ', 10, 3, '🗻'),
  ('33333333-3333-3333-3333-333333333333', 'たけ', 4, 4, '🎋'),
  ('44444444-4444-4444-4444-444444444444', 'うめ', 8, 4, '🌺'),
  ('55555555-5555-5555-5555-555555555555', 'まつ', 20, 5, '🌲');

insert into public.equipment (room_id, name) values
  ('11111111-1111-1111-1111-111111111111', 'モニター'),
  ('11111111-1111-1111-1111-111111111111', 'ホワイトボード'),
  ('22222222-2222-2222-2222-222222222222', 'プロジェクター'),
  ('22222222-2222-2222-2222-222222222222', 'ホワイトボード'),
  ('22222222-2222-2222-2222-222222222222', '電話会議'),
  ('33333333-3333-3333-3333-333333333333', 'モニター'),
  ('44444444-4444-4444-4444-444444444444', 'プロジェクター'),
  ('44444444-4444-4444-4444-444444444444', 'ホワイトボード'),
  ('55555555-5555-5555-5555-555555555555', 'プロジェクター'),
  ('55555555-5555-5555-5555-555555555555', 'マイク'),
  ('55555555-5555-5555-5555-555555555555', 'スピーカー'),
  ('55555555-5555-5555-5555-555555555555', 'ホワイトボード');
