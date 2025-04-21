import { ConnectorActivityList } from '@harnessio/ui/views'

export const mockConnectorActivityList = {
  content: [
    {
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'project',
          identifier: 'bittest1',
          accountIdentifier: 'px7xd_BFRCi-pfWPYXVjvw',
          orgIdentifier: 'default',
          projectIdentifier: 'abhinavtest3',
          parentUniqueId: 'vUF6sjOUR6ycGYYGxn9Njw',
          metadata: {
            connectorType: 'BITBUCKET'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: false,
          default: false,
          fullyQualifiedScopeIdentifier: 'px7xd_BFRCi-pfWPYXVjvw/default/abhinavtest3'
        },
        name: 'bittest1',
        entityGitMetadata: null
      },
      activityStatus: 'SUCCESS',
      activityTime: 1744997551429,
      description: 'Connector Created'
    }
  ]
} as ConnectorActivityList
