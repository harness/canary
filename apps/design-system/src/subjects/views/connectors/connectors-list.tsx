import { useState } from 'react'

import { noop } from 'lodash-es'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import {
  ConnectorListFilters,
  ConnectorListItem,
  ConnectorsListPage,
  ConnectorStats,
  EntityDeleteHandleDialog
} from '@harnessio/ui/views'

import mockConnectorsList from './mock-connectors-list.json'
import mockConnectorsStats from './mock-connectors-stats.json'

const ConnectorsListPageWrapper = (): JSX.Element => {
  const [alertDeleteParams, setAlertDeleteParams] = useState('')
  const [isAlertDeleteDialogOpen, setIsAlertDeleteDialogOpen] = useState(false)
  const [isEntityDeleteDialogOpen, setIsEntityDeleteDialogOpen] = useState(false)

  const openAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setIsAlertDeleteDialogOpen(true)
  }

  const onDeleteConnector = () => {
    setIsAlertDeleteDialogOpen(false)
    setIsEntityDeleteDialogOpen(true)
  }

  const [filterValues, setFilterValues] = useState<ConnectorListFilters>({})
  const filteredMockConnectorsList = mockConnectorsList.filter(connector => {
    return filterValues?.favorite ? connector.isFavorite : true
  })

  const handleFilterChange = (selectedValues: ConnectorListFilters) => {
    setFilterValues(selectedValues)
  }

  return (
    <>
      <ConnectorsListPage
        connectors={
          filteredMockConnectorsList.map(connector => ({
            name: connector.connector.name,
            identifier: connector.connector.identifier,
            type: connector.connector.type,
            status: connector.status,
            lastTestedAt: connector.status.lastTestedAt,
            lastModifiedAt: connector.lastModifiedAt,
            spec: {
              url: connector.connector.spec.url
            },
            gitDetails: {
              repoIdentifier: connector.gitDetails.repoIdentifier || '',
              branch: connector.gitDetails.branch || '',
              objectId: connector.gitDetails.objectId || ''
            },
            isFavorite: connector.isFavorite,
            createdAt: connector.createdAt
          })) as ConnectorListItem[]
        }
        connectorStats={mockConnectorsStats.data as ConnectorStats}
        isLoading={false}
        onFilterChange={handleFilterChange}
        setSearchQuery={noop}
        onEditConnector={noop}
        onDeleteConnector={openAlertDeleteDialog}
        onTestConnection={noop}
        onToggleFavoriteConnector={noop}
        currentPage={1}
        totalItems={filteredMockConnectorsList.length}
        pageSize={10}
        goToPage={noop}
        onCreate={noop}
      />

      <DeleteAlertDialog
        open={isAlertDeleteDialogOpen}
        onClose={() => setIsAlertDeleteDialogOpen(false)}
        deleteFn={onDeleteConnector}
        error={null}
        type="connector"
        identifier={alertDeleteParams}
      />
      <EntityDeleteHandleDialog
        isOpen={isEntityDeleteDialogOpen}
        onClose={() => setIsEntityDeleteDialogOpen(false)}
        forceDeleteCallback={noop}
        entityType="connector"
        entityId={alertDeleteParams}
        onViewReferences={noop}
      />
    </>
  )
}

export { ConnectorsListPageWrapper }
