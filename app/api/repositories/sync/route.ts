import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { supabase } from "@/lib/supabase/client";
import { githubService } from "@/services/github.service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.githubId) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body = await request.json();

    const { repositoryId } = body;

    const {
      data: repository,
      error: repositoryError,
    } = await supabase
      .from("repositories")
      .select("*")
      .eq("id", repositoryId)
      .maybeSingle();

    if (repositoryError) {
      throw repositoryError;
    }

    if (!repository) {
      return Response.json(
        {
          success: false,
          error: "Repository not found",
        },
        {
          status: 404,
        },
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("github_id", session.user.githubId.toString())
      .single();

    if (!user?.github_access_token) {
      throw new Error("GitHub token missing");
    }

    const [owner, repoName] = repository.full_name.split("/");

    const commits = await githubService.getCommits(
      user.github_access_token,
      owner,
      repoName,
    );

    const formattedCommits = commits
      .filter((commit) => commit.commit.author)
      .map((commit) => ({
        repository_id: repository.id,

        sha: commit.sha,

        message: commit.commit.message,

        author_name: commit.commit.author?.name,

        author_email: commit.commit.author?.email,

        committed_at: commit.commit.author?.date,
      }));

    const { error } = await supabase
      .from("commits")
      .upsert(formattedCommits, {
        onConflict: "sha",
      });

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      syncedCommits: formattedCommits.length,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to sync repository",
      },
      {
        status: 500,
      },
    );
  }
}