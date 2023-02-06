import { Database } from "../supabase/database.types";

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
