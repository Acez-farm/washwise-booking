-- Rode esse script inteiro no Supabase: Project → SQL Editor → New query → colar → Run

-- Tabela de agendamentos
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  price numeric not null,
  date date not null,
  time text not null,
  plate text not null,
  model text not null,
  name text not null,
  phone text not null,
  status text not null default 'Pendente' check (status in ('Pendente', 'Em Lavagem', 'Concluído')),
  created_at timestamptz not null default now()
);

-- Tabela de horários bloqueados manualmente pelo admin
create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  created_at timestamptz not null default now(),
  unique (date, time)
);

-- Ativa segurança em nível de linha (RLS) nas duas tabelas
alter table public.bookings enable row level security;
alter table public.blocked_slots enable row level security;

-- Qualquer visitante do site pode CRIAR um agendamento (fazer uma reserva)
create policy "Qualquer um pode criar agendamento"
  on public.bookings for insert
  to anon
  with check (true);

-- Qualquer visitante pode VER os horários bloqueados (precisa pra montar a grade de horários disponíveis)
create policy "Qualquer um pode ver horarios bloqueados"
  on public.blocked_slots for select
  to anon
  using (true);

-- Só usuário logado (admin) pode VER a lista de agendamentos
create policy "Admin pode ver agendamentos"
  on public.bookings for select
  to authenticated
  using (true);

-- Só usuário logado (admin) pode ATUALIZAR status de agendamento
create policy "Admin pode atualizar agendamentos"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

-- Só usuário logado (admin) pode CRIAR bloqueios de horário
create policy "Admin pode criar bloqueios"
  on public.blocked_slots for insert
  to authenticated
  with check (true);

-- Só usuário logado (admin) pode REMOVER bloqueios de horário
create policy "Admin pode remover bloqueios"
  on public.blocked_slots for delete
  to authenticated
  using (true);
