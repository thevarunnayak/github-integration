import { supabase } from "@/lib/supabase/client";

interface BootstrapUserParams {
  githubId: number;
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
  accessToken?: string;
}

export class UserService {
  async bootstrapUser({
    githubId,
    username,
    email,
    avatarUrl,
    accessToken,
  }: BootstrapUserParams) {
    // Check existing user
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("github_id", githubId.toString())
      .single();

    // Return existing user
    // Update existing user token
    if (existingUser) {
      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({
          github_access_token: accessToken,
        })
        .eq("id", existingUser.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedUser;
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        github_id: githubId.toString(),
        username,
        email,
        avatar_url: avatarUrl,
        github_access_token: accessToken,
      })
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    // Create default workspace
    const workspaceSlug = `${username
      .toLowerCase()
      .replace(/\s+/g, "-")}-workspace`;

    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .insert({
        name: `${username}'s Workspace`,
        slug: workspaceSlug,
        owner_id: user.id,
      })
      .select()
      .single();

    if (workspaceError) {
      throw workspaceError;
    }

    // Create default project
    const { error: projectError } = await supabase.from("projects").insert({
      workspace_id: workspace.id,
      name: "Core Platform",
      description: "Default engineering intelligence project",
    });

    if (projectError) {
      throw projectError;
    }

    return user;
  }
}

export const userService = new UserService();
