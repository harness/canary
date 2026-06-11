import type {
  AzureRepoConfig,
  BitbucketConnector,
  ConnectorInfo,
  GithubConnector,
  GitConfig,
  GitlabConnector
} from '@harnessio/react-ng-manager-v2-client'

/**
 * Git connector URL scope from ng-manager OpenAPI types (GitUrlType / ConnectionType in platform UI).
 * @see harness-core-ui ConnectorUtils.GitUrlType
 */
export type GitConnectorUrlType =
  | NonNullable<GithubConnector['type']>
  | NonNullable<GitlabConnector['type']>
  | NonNullable<BitbucketConnector['type']>
  | NonNullable<AzureRepoConfig['type']>
  | NonNullable<GitConfig['connectionType']>

/**
 * Reads account/repo/project scope from a git SCM connector using generated connector spec types.
 * ConnectorInfo.spec is typed as base ConnectorConfig, so we narrow via connector.type first.
 */
export function getGitConnectorUrlType(connector: ConnectorInfo): GitConnectorUrlType | undefined {
  switch (connector.type) {
    case 'Github':
      return (connector.spec as GithubConnector).type
    case 'Gitlab':
      return (connector.spec as GitlabConnector).type
    case 'Bitbucket':
      return (connector.spec as BitbucketConnector).type
    case 'AzureRepo':
      return (connector.spec as AzureRepoConfig).type
    case 'Git':
      return (connector.spec as GitConfig).connectionType
    default:
      return undefined
  }
}
