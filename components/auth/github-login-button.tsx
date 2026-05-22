"use client";

import { signIn } from "next-auth/react";

export function GitHubLoginButton() {
  return (
    <button
      onClick={() => signIn("github")}
      className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
    >
      Continue with GitHub
    </button>
  );
}