import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { ConnectorDetailsItem, ConnectorDetailsPage } from '@harnessio/ui/views'

import mockConnectorDetails from './mock-connector-details.json'

const ConnectorsDetailsPageWrapper = (): JSX.Element => (
  <ConnectorDetailsPage
    connectorDetails={{
      name: mockConnectorDetails.connector.name,
      identifier: mockConnectorDetails.connector.identifier,
      type: mockConnectorDetails.connector.type,
      status: mockConnectorDetails.status.status,
      lastTestedAt: mockConnectorDetails.status.lastTestedAt,
      lastModifiedAt: mockConnectorDetails.lastModifiedAt,
      spec: {
        url: mockConnectorDetails.connector.spec.url
      },
      gitDetails: {
        repoIdentifier: mockConnectorDetails.gitDetails.repoIdentifier || '',
        branch: mockConnectorDetails.gitDetails.branch || '',
        objectId: mockConnectorDetails.gitDetails.objectId || ''
      },
      lastConnectedAt: mockConnectorDetails.status.lastConnectedAt,
      createdAt: mockConnectorDetails.createdAt,
    } as ConnectorDetailsItem}
    useTranslationStore={useTranslationStore}
    onTest={noop}
  />
)

export { ConnectorsDetailsPageWrapper }
