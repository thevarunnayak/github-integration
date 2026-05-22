import { GitHubLoginButton } from "@/components/auth/github-login-button";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export default function HomePage() {
  return (
    <main className="flex min-h-screen bg-black text-white">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <div className="flex-1 p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-400">
              AI-Powered Engineering Intelligence
            </div>

            <h1 className="font-heading text-5xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="max-w-2xl text-zinc-400">
              Monitor engineering velocity, repository health,
              pull request analytics, hotspots, and AI-generated
              delivery insights.
            </p>

            <div className="pt-4">
              <GitHubLoginButton />
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Repository Health",
              "PR Throughput",
              "Review Time",
              "Release Frequency",
            ].map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-sm text-zinc-500">
                  {card}
                </p>

                <h3 className="mt-4 text-3xl font-bold">
                  92%
                </h3>

                <p className="mt-2 text-sm text-emerald-400">
                  +12% this week
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}