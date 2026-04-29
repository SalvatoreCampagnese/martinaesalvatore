-- Wedding RSVP schema for Martina e Salvatore
-- Run this in Supabase SQL editor.

create extension if not exists "uuid-ossp";

-- Lista degli invitati ufficiali (precaricata dagli sposi)
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

-- Ogni partecipante (l'invitato + accompagnatore + familiari)
create table if not exists public.rsvp_attendees (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid not null references public.rsvp_responses(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  relation text not null check (relation in ('main', 'plus_one', 'family')),
  allergies text,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_attendees_response_idx
  on public.rsvp_attendees (response_id);

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

-- Esempio inserimento invitati
-- insert into public.guests (first_name, last_name, has_plus_one)
-- values
--   ('Mario', 'Rossi', true),
--   ('Giulia', 'Bianchi', false);
