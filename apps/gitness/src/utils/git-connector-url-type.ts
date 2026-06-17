import type { ConnectorInfo, GithubConnector } from '@harnessio/react-ng-manager-v2-client'

export type GitConnectorUrlType = NonNullable<GithubConnector['type']>

/**
 * Extracts the URL scope (Account / Repo) from a GitHub connector.
 * Only GitHub is supported for linked repos today.
 */
export function getGitConnectorUrlType(connector: ConnectorInfo): GitConnectorUrlType | undefined {
  if (connector.type === 'Github') {
    return (connector.spec as GithubConnector).type
  }
  return undefined
}
