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

    if (attending) {
      if (attendees.length === 0) {
        return NextResponse.json(
          { error: "Aggiungi almeno un partecipante." },
          { status: 400 }
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

    const supabase = getSupabaseAdmin();

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
