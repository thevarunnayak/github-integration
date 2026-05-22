import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { supabase } from "@/lib/supabase/client";

export async function POST(
  request: Request
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.githubId) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await request.json();

    const { repository } = body;

    // Find user
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq(
        "github_id",
        session.user.githubId.toString()
      )
      .single();

    if (!user) {
      throw new Error("User not found");
    }

    // Find workspace
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    // Find project
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("workspace_id", workspace.id)
      .single();

    if (!project) {
      throw new Error("Project not found");
    }
    
    // Check existing repository
    const { data: existingRepository } =
    await supabase
        .from("repositories")
        .select("*")
        .eq(
        "github_repo_id",
        repository.id
        )
        .single();

    if (existingRepository) {
    return Response.json({
        success: true,
        alreadyImported: true,
        repository: existingRepository,
    });
    }

    // Save repository
    const {
      data: importedRepository,
      error,
    } = await supabase
      .from("repositories")
      .insert({
        project_id: project.id,

        github_repo_id: repository.id,

        name: repository.name,

        full_name: repository.full_name,

        description: repository.description,

        language: repository.language,

        stars:
          repository.stargazers_count,

        forks:
          repository.forks_count,

        default_branch:
          repository.default_branch,

        is_private: repository.private,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      repository: importedRepository,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to import repository",
      },
      {
        status: 500,
      }
    );
  }
}