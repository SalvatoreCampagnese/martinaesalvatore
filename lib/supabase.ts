import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getSupabaseAdmin() {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}

export function getSupabasePublic() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase public client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false }
  });
}

export type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  has_plus_one: boolean;
  created_at?: string;
};

export type AttendeePayload = {
  first_name: string;
  last_name: string;
  relation: "main" | "plus_one" | "family";
  allergies: string;
};
