-- Migration: collega ogni riga di rsvp_attendees direttamente al guest che
-- ha registrato la risposta (oltre alla relazione indiretta via response_id).
--
-- Run UNA volta nel SQL editor di Supabase. È idempotente: rilanciarla non
-- fa danno.

begin;

-- 1. Aggiungi la colonna come NULLABLE (per non rompere righe esistenti).
alter table public.rsvp_attendees
  add column if not exists guest_id uuid;

-- 2. Backfill: copia il guest_id dalla risposta associata.
update public.rsvp_attendees a
   set guest_id = r.guest_id
  from public.rsvp_responses r
 where a.response_id = r.id
   and a.guest_id is null;

-- 3. Aggiungi la foreign key (idempotente).
do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conname = 'rsvp_attendees_guest_id_fkey'
  ) then
    alter table public.rsvp_attendees
      add constraint rsvp_attendees_guest_id_fkey
      foreign key (guest_id)
      references public.guests(id)
      on delete cascade;
  end if;
end $$;

-- 4. Promuovi la colonna a NOT NULL ora che è popolata.
alter table public.rsvp_attendees
  alter column guest_id set not null;

-- 5. Indice per query del tipo "tutti i partecipanti registrati da X".
create index if not exists rsvp_attendees_guest_idx
  on public.rsvp_attendees (guest_id);

commit;
