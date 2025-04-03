import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { ConnectorListItem, ConnectorsListPage } from '@harnessio/ui/views'

import mockConnectorsList from './mock-connectors-list.json'

const ConnectorsListPageWrapper = (): JSX.Element => (
  <ConnectorsListPage
    connectors={
      mockConnectorsList.map(connector => ({
        name: connector.connector.name,
        identifier: connector.connector.identifier,
        type: connector.connector.type,
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
    onDeleteConnector={noop}
    onTestConnection={noop}
    currentPage={1}
    totalPages={5}
    goToPage={noop}
    onCreate={noop}
  />
)

export { ConnectorsListPageWrapper }
