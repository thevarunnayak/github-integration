import { supabase } from "@/lib/supabase/client";

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  return Response.json({
    success: !error,
    error,
    data,
  });
}