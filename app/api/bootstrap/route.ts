import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";
import { userService } from "@/services/user.service";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
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
    const user = await userService.bootstrapUser({
    githubId: session.user.githubId!,
    username: session.user.name || "Unknown",
    email: session.user.email,
    avatarUrl: session.user.image,
    accessToken: session.user.accessToken,
    });

    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to bootstrap user",
      },
      {
        status: 500,
      }
    );
  }
}