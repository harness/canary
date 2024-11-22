interface Repository {
  id: string
  name: string
  description?: string
  private: boolean
  stars: number
  forks: number
  pulls: number
  createdAt: string
  timestamp: string
}

export type { Repository }
