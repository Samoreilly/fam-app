import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const FAMILY_MEMBERS = [
  "Sam",
  "Orla",
  "Alex",
  "Ruth",
  "Ian",
  "Zach",
  "Amelia",
] as const;

export type FamilyMember = (typeof FAMILY_MEMBERS)[number];

export interface Food {
  id: string;
  name: string;
  created_at: string;
}

export interface PersonFood {
  id: string;
  person_name: string;
  food_id: string;
  created_at: string;
}
