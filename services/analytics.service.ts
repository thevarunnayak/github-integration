export class AnalyticsService {
  async getRepositoryHealth() {
    return {
      score: 92,
      trend: 12,
    };
  }

  async getPullRequestMetrics() {
    return [];
  }
}

export const analyticsService = new AnalyticsService();