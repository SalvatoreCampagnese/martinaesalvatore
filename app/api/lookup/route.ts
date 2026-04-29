import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { normalize } from "@/lib/normalize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body?.firstName ?? "");
    const lastName = String(body?.lastName ?? "");

    if (!firstName.trim() || !lastName.trim()) {
      return NextResponse.json(
        { error: "Inserisci nome e cognome." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: guests, error } = await supabase
      .from("guests")
      .select("id, first_name, last_name, has_plus_one");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const targetFirst = normalize(firstName);
    const targetLast = normalize(lastName);

    const guest = (guests ?? []).find(
      (g) =>
        normalize(g.first_name) === targetFirst &&
        normalize(g.last_name) === targetLast
    );

    if (!guest) {
      return NextResponse.json(
        {
          found: false,
          error:
            "Non troviamo il tuo nome nella nostra lista. Controlla l'ortografia o contattaci."
        },
        { status: 404 }
      );
    }

    // Carica anche un eventuale RSVP precedente, così il form si precompila.
    const { data: existingResponse } = await supabase
      .from("rsvp_responses")
      .select("id, attending, notes")
      .eq("guest_id", guest.id)
      .maybeSingle();

    let existingAttendees: Array<{
      first_name: string;
      last_name: string;
      relation: "main" | "plus_one" | "family";
      allergies: string | null;
    }> = [];

    if (existingResponse?.id) {
      const { data: attendees } = await supabase
        .from("rsvp_attendees")
        .select("first_name, last_name, relation, allergies, created_at")
        .eq("response_id", existingResponse.id)
        .order("created_at", { ascending: true });
      existingAttendees = (attendees ?? []).map((a) => ({
        first_name: a.first_name,
        last_name: a.last_name,
        relation: a.relation as "main" | "plus_one" | "family",
        allergies: a.allergies
      }));
    }

    return NextResponse.json({
      found: true,
      guest,
      response: existingResponse
        ? {
            attending: existingResponse.attending,
            notes: existingResponse.notes ?? ""
          }
        : null,
      attendees: existingAttendees
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Errore sconosciuto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
