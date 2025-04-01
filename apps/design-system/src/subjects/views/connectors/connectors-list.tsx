import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { ConnectorListItem, ConnectorListPage } from '@harnessio/ui/views'

import mockConnectorsList from './mock-connectors-list.json'

const ConnectorsListPage = (): JSX.Element => (
  <ConnectorListPage
    connectors={
      mockConnectorsList.map(connector => ({
        name: connector.connector.name,
        identifier: connector.connector.identifier,
        status: connector.status.status,
        lastTestedAt: connector.status.lastTestedAt,
        lastModifiedAt: connector.lastModifiedAt,
        spec: {
          url: connector.connector.spec.url
        },
        gitDetails: {
          repoIdentifier: connector.gitDetails.repoIdentifier || '',
          branch: connector.gitDetails.branch || '',
          objectId: connector.gitDetails.objectId || ''
        }
      })) as ConnectorListItem[]
    }
    useTranslationStore={useTranslationStore}
    isLoading={false}
    setSearchQuery={noop}
    onEditConnector={noop}
    onTestConnection={noop}
    currentPage={1}
    totalPages={5}
    goToPage={noop}
  />
)

export { ConnectorsListPage }
