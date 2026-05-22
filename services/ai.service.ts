export class AIService {
  async generateRepositorySummary() {
    return `
      Repository health improved this week due to
      faster review turnaround and lower PR cycle time.
    `;
  }
}

export const aiService = new AIService();