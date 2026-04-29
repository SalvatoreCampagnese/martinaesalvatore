-- Wedding RSVP schema for Martina e Salvatore
-- Run this in Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- Lista degli invitati ufficiali (precaricata dagli sposi)
-- has_plus_one = true SOLO per gli invitati a cui concedete un accompagnatore.
-- Default false: la maggior parte degli invitati NON può portare un +1.
create table if not exists public.guests (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  has_plus_one boolean not null default false,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create unique index if not exists guests_full_name_idx
  on public.guests (lower(first_name), lower(last_name));

-- Risposta principale del singolo invitato
create table if not exists public.rsvp_responses (
  id uuid primary key default uuid_generate_v4(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  attending boolean not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guest_id)
);

-- Ogni partecipante (l'invitato + accompagnatore + familiari).
-- guest_id collega ogni riga all'INVITATO ufficiale che ha registrato la
-- risposta: per relation='main' è lo stesso invitato, per 'plus_one' e
-- 'family' è la persona che lo/la sta portando.
create table if not exists public.rsvp_attendees (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid not null references public.rsvp_responses(id) on delete cascade,
  guest_id uuid not null references public.guests(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  relation text not null check (relation in ('main', 'plus_one', 'family')),
  allergies text,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_attendees_response_idx
  on public.rsvp_attendees (response_id);
create index if not exists rsvp_attendees_guest_idx
  on public.rsvp_attendees (guest_id);

-- Per database già esistenti senza la colonna guest_id:
-- esegui supabase/migrations/0001_add_guest_id_to_attendees.sql

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_rsvp_responses_updated on public.rsvp_responses;
create trigger trg_rsvp_responses_updated
  before update on public.rsvp_responses
  for each row execute function public.set_updated_at();

-- RLS: tutto chiuso lato pubblico, le API usano la service role key
alter table public.guests enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.rsvp_attendees enable row level security;

-- Vincolo applicativo: i partecipanti con relation = 'plus_one' sono accettati
-- dall'API solo se il guest associato ha has_plus_one = true (validato in
-- /app/api/rsvp/route.ts), e al massimo uno per invitato.

-- Esempio: inserimento invitati con e senza diritto al +1.
-- insert into public.guests (first_name, last_name, has_plus_one) values
--   ('Mario', 'Rossi', true),     -- può portare un accompagnatore
--   ('Giulia', 'Bianchi', false), -- da sola (eventuali familiari sì)
--   ('Luca', 'Neri', false);

-- Per concedere/revocare il +1 a un invitato esistente:
-- update public.guests set has_plus_one = true
--  where lower(first_name) = 'mario' and lower(last_name) = 'rossi';

-- Query utili per gli sposi ----------------------------------------------

-- Tutti i partecipanti registrati DA un invitato (lui + suoi familiari/+1):
-- select a.first_name, a.last_name, a.relation, a.allergies
--   from public.rsvp_attendees a
--   join public.guests g on g.id = a.guest_id
--  where lower(g.first_name) = 'mario' and lower(g.last_name) = 'rossi'
--  order by case a.relation when 'main' then 0 when 'plus_one' then 1 else 2 end;

-- Conteggio totale partecipanti confermati e dettaglio per invitato:
-- select g.first_name, g.last_name,
--        count(*)                              as totale,
--        count(*) filter (where relation='main')      as principali,
--        count(*) filter (where relation='plus_one')  as accompagnatori,
--        count(*) filter (where relation='family')    as familiari
--   from public.rsvp_attendees a
--   join public.guests g on g.id = a.guest_id
--   join public.rsvp_responses r on r.id = a.response_id
--  where r.attending = true
--  group by g.id, g.first_name, g.last_name
--  order by g.last_name;
