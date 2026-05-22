interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
}

interface GitHubCommit {
  sha: string;

  commit: {
    message: string;

    author: {
      name: string;
      email: string;
      date: string;
    };
  };
}

export class GithubService {
  async getRepositories(accessToken: string): Promise<GitHubRepository[]> {
    const response = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    return response.json();
  }

  async getCommits(
    accessToken: string,
    owner: string,
    repository: string,
  ): Promise<GitHubCommit[]> {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repository}/commits?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch commits");
    }

    return response.json();
  }
}

export const githubService = new GithubService();
