import { SearchResultItem } from '@harnessio/ui/views'

export interface SearchResultsStore {
  results: SearchResultItem[]
  page: number
  xNextPage: number
  xPrevPage: number
  setPage: (page: number) => void
  setPaginationFromHeaders: () => void
  setResults: (results: SearchResultItem[]) => void
  addResult: (result: SearchResultItem) => void
  removeResult: (id: string) => void
}

export const searchResultsStore: SearchResultsStore = {
  results: [
    {
      id: '1',
      title: 'Deployment Pipeline Configuration',
      description: 'Configuration for CI/CD pipeline with automated testing and deployment',
      type: 'Document',
      url: '/documents/deployment-pipeline'
    },
    {
      id: '2',
      title: 'User Authentication Service',
      description: 'Microservice handling user authentication and authorization',
      type: 'Service',
      url: '/services/auth'
    },
    {
      id: '3',
      title: 'Dashboard Analytics Component',
      description: 'React component for displaying analytics data in the dashboard',
      type: 'Component',
      url: '/components/analytics'
    },
    {
      id: '4',
      title: 'Database Migration Scripts',
      description: 'SQL scripts for database schema migrations',
      type: 'Script',
      url: '/scripts/db-migrations'
    },
    {
      id: '5',
      title: 'Infrastructure as Code Templates',
      description: 'Terraform templates for provisioning cloud infrastructure',
      type: 'Infrastructure',
      url: '/infrastructure/templates'
    },
    {
      id: '6',
      title: 'API Documentation',
      description: 'OpenAPI documentation for REST endpoints',
      type: 'Documentation',
      url: '/docs/api'
    }
  ],
  page: 1,
  xNextPage: 2,
  xPrevPage: 0,
  setPage: () => {},
  setPaginationFromHeaders: () => {},
  setResults: () => {},
  addResult: () => {},
  removeResult: () => {}
}
