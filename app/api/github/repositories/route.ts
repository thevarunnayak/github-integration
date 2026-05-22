import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { githubService } from "@/services/github.service";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
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
    const repositories =
      await githubService.getRepositories(
        session.user.accessToken
      );

    return Response.json({
      success: true,
      repositories,
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
      }
    );
  }
}