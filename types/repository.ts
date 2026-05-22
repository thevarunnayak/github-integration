export interface Repository {
  id: string;
  name: string;
  fullName: string;
  language?: string;
  stars: number;
  forks: number;
  healthScore?: number;
}