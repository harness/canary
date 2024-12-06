// TODO: we should rethink the approach and stop using the @date-fns library

import { RepositoryType } from '@views/repo/repo.types'
import { formatDistanceToNow } from 'date-fns'

/**
 * Formats repository data for display
 * Adds formatted timestamps and any other display-specific data
 */
export const formatRepositories = (repositories: RepositoryType[]): RepositoryType[] => {
  return repositories.map(repo => ({
    ...repo,
    timestamp: formatDistanceToNow(new Date(repo.createdAt), {
      addSuffix: true,
      includeSeconds: true
    }).replace('about ', '')
  }))
}
