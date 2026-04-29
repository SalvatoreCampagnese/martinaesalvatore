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
3. Inserisci gli invitati nella tabella `guests`:

```sql
insert into public.guests (first_name, last_name, has_plus_one) values
  ('Mario', 'Rossi', true),
  ('Giulia', 'Bianchi', false);
```

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
4. L'API `/api/rsvp` fa upsert su `rsvp_responses` e ricrea le righe in `rsvp_attendees`.

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
