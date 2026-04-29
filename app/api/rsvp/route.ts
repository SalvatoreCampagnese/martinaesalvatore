import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type IncomingAttendee = {
  first_name: string;
  last_name: string;
  relation: "main" | "plus_one" | "family";
  allergies?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const guestId = String(body?.guestId ?? "");
    const attending = Boolean(body?.attending);
    const notes = String(body?.notes ?? "").slice(0, 1000);
    const attendees: IncomingAttendee[] = Array.isArray(body?.attendees)
      ? body.attendees
      : [];

    if (!guestId) {
      return NextResponse.json(
        { error: "Identificativo invitato mancante." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify guest exists and read the +1 entitlement from the DB
    // (don't trust the client).
    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .select("id, has_plus_one")
      .eq("id", guestId)
      .maybeSingle();

    if (guestError) {
      return NextResponse.json(
        { error: guestError.message },
        { status: 500 }
      );
    }
    if (!guest) {
      return NextResponse.json(
        { error: "Invitato non trovato." },
        { status: 404 }
      );
    }

    if (attending) {
      if (attendees.length === 0) {
        return NextResponse.json(
          { error: "Aggiungi almeno un partecipante." },
          { status: 400 }
        );
      }

      const mainCount = attendees.filter((a) => a.relation === "main").length;
      const plusOneCount = attendees.filter(
        (a) => a.relation === "plus_one"
      ).length;

      if (mainCount !== 1) {
        return NextResponse.json(
          { error: "L'invitato principale deve essere presente una sola volta." },
          { status: 400 }
        );
      }

      if (plusOneCount > 1) {
        return NextResponse.json(
          { error: "Puoi aggiungere al massimo un accompagnatore." },
          { status: 400 }
        );
      }

      if (plusOneCount > 0 && !guest.has_plus_one) {
        return NextResponse.json(
          {
            error:
              "L'invito non prevede un accompagnatore. Per aggiungere altre persone usa la voce 'familiare'."
          },
          { status: 403 }
        );
      }

      for (const a of attendees) {
        if (!a.first_name?.trim() || !a.last_name?.trim()) {
          return NextResponse.json(
            { error: "Nome e cognome sono obbligatori per tutti." },
            { status: 400 }
          );
        }
      }
    }

    const { data: response, error: respError } = await supabase
      .from("rsvp_responses")
      .upsert(
        {
          guest_id: guestId,
          attending,
          notes
        },
        { onConflict: "guest_id" }
      )
      .select()
      .single();

    if (respError) {
      return NextResponse.json({ error: respError.message }, { status: 500 });
    }

    // Reset attendees for this response, then insert anew
    await supabase
      .from("rsvp_attendees")
      .delete()
      .eq("response_id", response.id);

    if (attending && attendees.length > 0) {
      const rows = attendees.map((a) => ({
        response_id: response.id,
        guest_id: guestId,
        first_name: a.first_name.trim(),
        last_name: a.last_name.trim(),
        relation: a.relation,
        allergies: (a.allergies ?? "").trim()
      }));

      const { error: insertError } = await supabase
        .from("rsvp_attendees")
        .insert(rows);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Errore sconosciuto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
