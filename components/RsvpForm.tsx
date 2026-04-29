"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  has_plus_one: boolean;
};

type Attendee = {
  id: string;
  first_name: string;
  last_name: string;
  relation: "main" | "plus_one" | "family";
  allergies: string;
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function RsvpForm() {
  const [step, setStep] = useState<"lookup" | "form" | "done">("lookup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [guest, setGuest] = useState<Guest | null>(null);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [doneAttending, setDoneAttending] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName })
      });
      const json = await res.json();
      if (!res.ok || !json.found) {
        throw new Error(json.error ?? "Invitato non trovato.");
      }
      const g: Guest = json.guest;
      setGuest(g);
      setAttendees([
        {
          id: newId(),
          first_name: g.first_name,
          last_name: g.last_name,
          relation: "main",
          allergies: ""
        }
      ]);
      setStep("form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore.");
    } finally {
      setLoading(false);
    }
  }

  function addPlusOne() {
    setAttendees((arr) => [
      ...arr,
      {
        id: newId(),
        first_name: "",
        last_name: "",
        relation: "plus_one",
        allergies: ""
      }
    ]);
  }

  function addFamily() {
    setAttendees((arr) => [
      ...arr,
      {
        id: newId(),
        first_name: "",
        last_name: "",
        relation: "family",
        allergies: ""
      }
    ]);
  }

  function removeAttendee(id: string) {
    setAttendees((arr) => arr.filter((a) => a.id !== id));
  }

  function updateAttendee(id: string, patch: Partial<Attendee>) {
    setAttendees((arr) =>
      arr.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guest || attending === null) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guest.id,
          attending,
          notes,
          attendees: attending
            ? attendees.map((a) => ({
                first_name: a.first_name,
                last_name: a.last_name,
                relation: a.relation,
                allergies: a.allergies
              }))
            : []
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Errore.");
      setDoneAttending(attending);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore.");
    } finally {
      setLoading(false);
    }
  }

  const hasPlusOne = attendees.some((a) => a.relation === "plus_one");

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {step === "lookup" && (
          <motion.form
            key="lookup"
            onSubmit={handleLookup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="rounded-md border border-bordeaux/15 bg-cream p-8 shadow-[0_30px_80px_-40px_rgba(122,4,2,0.4)] sm:p-12"
          >
            <p className="text-center font-sans text-[11px] uppercase tracking-[0.45em] text-bordeaux/70">
              R.S.V.P
            </p>
            <h2 className="mt-3 text-center font-script text-5xl text-bordeaux">
              Conferma la presenza
            </h2>
            <p className="mt-4 text-center font-serif text-base italic text-stone-600">
              Inserisci il tuo nome e cognome come riportato sull&apos;invito.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="label-elegant" htmlFor="firstName">
                  Nome
                </label>
                <input
                  id="firstName"
                  className="input-elegant"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label-elegant" htmlFor="lastName">
                  Cognome
                </label>
                <input
                  id="lastName"
                  className="input-elegant"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-6 text-center font-serif text-sm italic text-bordeaux">
                {error}
              </p>
            )}

            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-bordeaux"
              >
                {loading ? "ricerca…" : "continua"}
              </button>
            </div>
          </motion.form>
        )}

        {step === "form" && guest && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="rounded-md border border-bordeaux/15 bg-cream p-8 shadow-[0_30px_80px_-40px_rgba(122,4,2,0.4)] sm:p-12"
          >
            <p className="text-center font-sans text-[11px] uppercase tracking-[0.45em] text-bordeaux/70">
              ciao {guest.first_name}
            </p>
            <h2 className="mt-3 text-center font-script text-4xl text-bordeaux sm:text-5xl">
              Sarai dei nostri?
            </h2>

            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all ${
                  attending === true
                    ? "border-bordeaux bg-bordeaux text-cream"
                    : "border-bordeaux/40 text-bordeaux hover:bg-bordeaux/10"
                }`}
              >
                ci saremo
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`rounded-full border px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all ${
                  attending === false
                    ? "border-bordeaux bg-bordeaux text-cream"
                    : "border-bordeaux/40 text-bordeaux hover:bg-bordeaux/10"
                }`}
              >
                non potrò esserci
              </button>
            </div>

            {attending === true && (
              <div className="mt-12 flex flex-col gap-8">
                <div className="text-center">
                  <span className="ornament block" />
                  <p className="mt-6 font-serif text-base italic text-stone-600">
                    Compila i dati per ciascun partecipante. Indica eventuali
                    allergie o intolleranze.
                  </p>
                  <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.3em] text-bordeaux/70">
                    {guest.has_plus_one
                      ? "il tuo invito include un accompagnatore"
                      : "il tuo invito è valido per la sola persona indicata"}
                  </p>
                </div>

                {attendees.map((a, idx) => (
                  <div
                    key={a.id}
                    className="rounded-md border border-bordeaux/15 bg-cream-dark/30 p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-bordeaux/80">
                        {a.relation === "main"
                          ? "invitato"
                          : a.relation === "plus_one"
                          ? "accompagnatore"
                          : `familiare`}
                      </span>
                      {a.relation !== "main" && (
                        <button
                          type="button"
                          onClick={() => removeAttendee(a.id)}
                          className="font-sans text-[10px] uppercase tracking-[0.3em] text-bordeaux/60 hover:text-bordeaux"
                        >
                          rimuovi
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label-elegant">Nome</label>
                        <input
                          className="input-elegant"
                          value={a.first_name}
                          onChange={(e) =>
                            updateAttendee(a.id, {
                              first_name: e.target.value
                            })
                          }
                          required
                          disabled={a.relation === "main"}
                        />
                      </div>
                      <div>
                        <label className="label-elegant">Cognome</label>
                        <input
                          className="input-elegant"
                          value={a.last_name}
                          onChange={(e) =>
                            updateAttendee(a.id, {
                              last_name: e.target.value
                            })
                          }
                          required
                          disabled={a.relation === "main"}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="label-elegant">
                        Allergie e intolleranze
                      </label>
                      <textarea
                        className="input-elegant min-h-[80px] resize-y"
                        placeholder="Es. lattosio, glutine, frutta secca…"
                        value={a.allergies}
                        onChange={(e) =>
                          updateAttendee(a.id, { allergies: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap justify-center gap-4">
                  {guest.has_plus_one && !hasPlusOne && (
                    <button
                      type="button"
                      onClick={addPlusOne}
                      className="btn-outline"
                    >
                      + accompagnatore
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addFamily}
                    className="btn-outline"
                  >
                    + familiare
                  </button>
                </div>

                <div>
                  <label className="label-elegant">Un messaggio per noi</label>
                  <textarea
                    className="input-elegant min-h-[100px] resize-y"
                    placeholder="Lasciaci un messaggio (facoltativo)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {attending === false && (
              <div className="mt-10 text-center">
                <p className="font-serif text-base italic text-stone-600">
                  Ci dispiace non poterti avere accanto a noi. Grazie comunque
                  di cuore.
                </p>
                <div className="mt-6">
                  <label className="label-elegant text-left">
                    Vuoi lasciarci un messaggio?
                  </label>
                  <textarea
                    className="input-elegant min-h-[100px] resize-y"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="mt-6 text-center font-serif text-sm italic text-bordeaux">
                {error}
              </p>
            )}

            {attending !== null && (
              <div className="mt-10 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-bordeaux"
                >
                  {loading ? "invio…" : "conferma"}
                </button>
              </div>
            )}
          </motion.form>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-md border border-bordeaux/15 bg-cream p-12 text-center shadow-[0_30px_80px_-40px_rgba(122,4,2,0.4)]"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.45em] text-bordeaux/70">
              grazie
            </p>
            <h2 className="mt-4 font-script text-5xl text-bordeaux">
              {doneAttending
                ? "Non vediamo l'ora!"
                : "Ti penseremo con affetto"}
            </h2>
            <div className="ornament mt-6" />
            <p className="mt-6 font-serif text-base italic text-stone-600">
              {doneAttending
                ? "La tua conferma è stata registrata. Ti aspettiamo il 9 maggio 2027 alle 17:30 a La Gaiana."
                : "Abbiamo registrato la tua risposta. Sarai con noi nel cuore."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
