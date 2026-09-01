import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://haseqgqqgrjpkualauuh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc2VxZ3FxZ3JqcGt1YWxhdXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjA4ODksImV4cCI6MjEwMzgzNjg4OX0.2R7EGeq23fKrsy2SHPBL0SqI1itfxWEiXV3-BLDo9_s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
