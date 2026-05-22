"use client";

import { useEffect, useState } from "react";

import { GitBranch, Lock, Globe, Star, GitFork, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  default_branch: string;
}

interface ImportedRepository {
  id: string;
  github_repo_id: number;
  full_name: string;
}

interface RepositoryAnalytics {
  totalCommits: number;
  contributors: number;

  latestCommit: {
    committed_at: string;
  } | null;
}

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const [loading, setLoading] = useState(true);

  const [importingId, setImportingId] = useState<number | null>(null);

  const [importedRepositories, setImportedRepositories] = useState<
    ImportedRepository[]
  >([]);

  const [syncingRepositories, setSyncingRepositories] = useState<
    Record<string, boolean>
  >({});

  const [analytics, setAnalytics] = useState<
    Record<string, RepositoryAnalytics>
  >({});

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const [githubRepositoriesResponse, importedRepositoriesResponse] =
          await Promise.all([
            fetch("/api/github/repositories"),
            fetch("/api/repositories"),
          ]);

        const githubRepositoriesData = await githubRepositoriesResponse.json();

        const importedRepositoriesData =
          await importedRepositoriesResponse.json();

        setRepositories(githubRepositoriesData.repositories || []);

        setImportedRepositories(importedRepositoriesData.repositories || []);

        for (const repository of importedRepositoriesData.repositories || []) {
          await fetchAnalytics(repository.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, []);

  async function importRepository(repository: Repository) {
    try {
      setImportingId(repository.id);

      const response = await fetch("/api/repositories/import", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          repository,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setImportedRepositories((prev) => [
          ...prev,
          {
            id: data.repository.id,
            github_repo_id: repository.id,
            full_name: repository.full_name,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setImportingId(null);
    }
  }

  async function syncRepository(repositoryId: string) {
    try {
      setSyncingRepositories((prev) => ({
        ...prev,
        [repositoryId]: true,
      }));

      const response = await fetch("/api/repositories/sync", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          repositoryId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchAnalytics(repositoryId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSyncingRepositories((prev) => ({
        ...prev,
        [repositoryId]: false,
      }));
    }
  }

  async function fetchAnalytics(repositoryId: string) {
    try {
      const response = await fetch(
        `/api/analytics/repository?repositoryId=${repositoryId}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (data.success) {
        setAnalytics((prev) => ({
          ...prev,

          [repositoryId]: data.analytics,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="space-y-3">
        <div className="inline-flex rounded-full border border-border bg-card px-4 py-1 text-sm text-muted-foreground">
          GitHub Integration
        </div>

        <h1 className="font-heading text-5xl font-bold tracking-tight">
          Repositories
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Connect repositories to begin generating engineering intelligence,
          analytics, repository health insights, and delivery intelligence.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 text-muted-foreground">
          Loading repositories...
        </div>
      ) : (
        <div className="mt-10 grid gap-5">
          {repositories.map((repo) => {
            const importedRepository = importedRepositories.find(
              (repository) => repository.github_repo_id === repo.id,
            );

            console.log(importedRepository);

            const isImported = Boolean(importedRepository);

            return (
              <div
                key={repo.id}
                className="rounded-3xl border border-border bg-card/80 p-6 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold">
                        {repo.full_name}
                      </h2>

                      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {repo.private ? (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            Private
                          </>
                        ) : (
                          <>
                            <Globe className="h-3.5 w-3.5" />
                            Public
                          </>
                        )}
                      </div>
                    </div>

                    <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {repo.description ||
                        "No repository description provided."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isImported ? (
                      <Button
                        onClick={() => importRepository(repo)}
                        disabled={importingId === repo.id}
                        className="rounded-xl"
                      >
                        {importingId === repo.id
                          ? "Connecting..."
                          : "Connect Repository"}
                      </Button>
                    ) : (
                      <>
                        <div className="rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-400">
                          Connected
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => {
                            if (importedRepository) {
                              syncRepository(importedRepository.id);
                            }
                          }}
                          disabled={
                            importedRepository
                              ? syncingRepositories[importedRepository.id]
                              : false
                          }
                          className="rounded-xl"
                        >
                          {importedRepository &&
                          syncingRepositories[importedRepository.id]
                            ? "Syncing..."
                            : "Sync Repository"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />

                    <span>{repo.stargazers_count}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GitFork className="h-4 w-4" />

                    <span>{repo.forks_count}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4" />

                    <span>{repo.language || "Unknown"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />

                    <span>{repo.default_branch}</span>
                  </div>
                </div>

                {importedRepository && analytics[importedRepository.id] && (
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/50 p-4">
                      <p className="text-xs text-muted-foreground">
                        Total Commits
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {analytics[importedRepository.id].totalCommits}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/50 p-4">
                      <p className="text-xs text-muted-foreground">
                        Contributors
                      </p>

                      <h3 className="mt-2 text-2xl font-bold">
                        {analytics[importedRepository.id].contributors}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/50 p-4">
                      <p className="text-xs text-muted-foreground">
                        Latest Activity
                      </p>

                      <h3 className="mt-2 text-sm font-medium">
                        {analytics[importedRepository.id].latestCommit
                          ?.committed_at
                          ? new Date(
                              analytics[importedRepository.id].latestCommit!
                                .committed_at,
                            ).toLocaleDateString()
                          : "No activity"}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
