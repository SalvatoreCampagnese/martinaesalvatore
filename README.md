# Martina e Salvatore — Sito di Matrimonio

Sito di nozze in Next.js + Tailwind, ispirato a [majestic-template.thedigitalyes.com](https://majestic-template.thedigitalyes.com/).

- 9 maggio 2027 · ore 17:30
- La Gaiana — Castel San Pietro Terme (BO)
- Colori: bordeaux `#A20603` su panna `#FFFAF3`
- Font: **Montserrat** (sans), **Judson** (serif), **MonteCarlo** (corsivo)

## Requisiti

- Node.js 18+
- Account Supabase

## Setup

```bash
npm install
cp .env.example .env.local
# inserisci le tre chiavi Supabase in .env.local
npm run dev
```

Apri http://localhost:3000.

## Supabase

1. Crea un progetto su https://supabase.com
2. Vai su **SQL editor** ed esegui il contenuto di `supabase/schema.sql`
   (per un nuovo progetto). Se il database esiste già da prima dell'aggiunta
   della colonna `guest_id` su `rsvp_attendees`, esegui invece in sequenza
   le migrations in `supabase/migrations/` (al momento solo
   `0001_add_guest_id_to_attendees.sql`).
3. Inserisci gli invitati nella tabella `guests`. La colonna `has_plus_one`
   controlla **chi** può aggiungere un accompagnatore: solo gli invitati con
   `has_plus_one = true` vedranno il bottone `+ accompagnatore` e potranno
   inserirlo (validato anche server-side, non si può aggirare via API).

```sql
insert into public.guests (first_name, last_name, has_plus_one) values
  ('Mario', 'Rossi', true),     -- può portare un +1
  ('Giulia', 'Bianchi', false), -- da sola
  ('Luca', 'Neri', false);

-- Per concederlo dopo:
update public.guests set has_plus_one = true
 where lower(first_name) = 'luca' and lower(last_name) = 'neri';
```

I familiari aggiuntivi sono **sempre** ammessi e illimitati per ogni invitato.

4. Copia in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` (Settings → API → Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Settings → API → anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role) — **solo server**

## Flusso RSVP

`/rsvp`:

1. L'invitato inserisce nome e cognome.
2. L'API `/api/lookup` cerca un match case-insensitive nella tabella `guests`.
3. Se trovato, può:
   - dichiarare se sarà presente
   - aggiungere un accompagnatore (solo se `has_plus_one = true`)
   - aggiungere infiniti familiari
   - indicare allergie/intolleranze per ognuno
   - lasciare un messaggio
4. L'API `/api/rsvp` fa upsert su `rsvp_responses` e ricrea le righe in
   `rsvp_attendees`. **Ogni** riga di `rsvp_attendees` (invitato principale,
   accompagnatore, familiari) ha un `guest_id` che punta all'invitato
   ufficiale che li sta registrando, così è possibile risalire facilmente a
   chi ha portato chi.

### Query utili

Tutte le persone registrate da un certo invitato:

```sql
select a.first_name, a.last_name, a.relation, a.allergies
  from public.rsvp_attendees a
  join public.guests g on g.id = a.guest_id
 where lower(g.first_name) = 'mario' and lower(g.last_name) = 'rossi';
```

Riepilogo confermati per invitato:

```sql
select g.first_name, g.last_name, count(*) as totale,
       count(*) filter (where relation='main')      as principali,
       count(*) filter (where relation='plus_one')  as accompagnatori,
       count(*) filter (where relation='family')    as familiari
  from public.rsvp_attendees a
  join public.guests g on g.id = a.guest_id
  join public.rsvp_responses r on r.id = a.response_id
 where r.attending = true
 group by g.id, g.first_name, g.last_name
 order by g.last_name;
```

## Struttura

```
app/
  layout.tsx            # font + metadata
  page.tsx              # home con animazione busta + sezioni
  rsvp/page.tsx         # pagina RSVP
  api/lookup/route.ts   # validazione invitato
  api/rsvp/route.ts     # salvataggio risposta
components/
  EnvelopeHero.tsx      # busta sigillata animata
  HeroNames.tsx         # nomi calligrafici principali
  StorySection.tsx      # frase corsiva "Ci siamo conosciuti..."
  DateSection.tsx       # 09 maggio 2027 + countdown
  Countdown.tsx
  VenueSection.tsx      # La Gaiana + mappa
  ProgramSection.tsx    # programma giornata
  RsvpCallToAction.tsx
  RsvpForm.tsx          # form multi-step
  FloralCorner.tsx      # decorazioni floreali agli angoli
  SectionHeader.tsx
  Footer.tsx
lib/
  supabase.ts           # admin + public client
  normalize.ts          # match nomi senza accenti/case
supabase/
  schema.sql            # script DDL
public/assets/
  rose.png              # decorazione floreale
  invito-fronte.pdf
  invito-retro.pdf
```

## Deploy

Compatibile con Vercel out-of-the-box. Imposta le tre variabili Supabase
nelle environment variables del progetto.
