import { supabase } from "@/lib/supabase/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const repositoryId =
      searchParams.get("repositoryId");

    if (!repositoryId) {
      return Response.json(
        {
          success: false,
          error: "Repository ID missing",
        },
        {
          status: 400,
        },
      );
    }

    const { data: commits, error } =
      await supabase
        .from("commits")
        .select("*")
        .eq("repository_id", repositoryId)
        .order("committed_at", {
          ascending: false,
        });

    if (error) {
      throw error;
    }

    const totalCommits =
      commits?.length || 0;

    const contributors =
      new Set(
        commits?.map(
          (commit) =>
            commit.author_email,
        ) || [],
      ).size;

    const latestCommit =
      commits?.[0] || null;

    return Response.json({
      success: true,

      analytics: {
        totalCommits,
        contributors,
        latestCommit,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error:
          "Failed to fetch analytics",
      },
      {
        status: 500,
      },
    );
  }
}