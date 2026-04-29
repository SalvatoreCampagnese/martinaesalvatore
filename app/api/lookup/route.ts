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

    const { data, error } = await supabase
      .from("guests")
      .select("id, first_name, last_name, has_plus_one");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const targetFirst = normalize(firstName);
    const targetLast = normalize(lastName);

    const guest = (data ?? []).find(
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

    return NextResponse.json({ found: true, guest });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Errore sconosciuto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
