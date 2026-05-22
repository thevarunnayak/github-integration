import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("repositories")
      .select("id, github_repo_id, full_name");

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      repositories: data,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch repositories",
      },
      {
        status: 500,
      },
    );
  }
}