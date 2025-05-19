import { useState } from 'react'

import { useTranslationStore } from '@utils/viewUtils'
import { noop } from 'lodash-es'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { ConnectorListFilters, ConnectorListItem, ConnectorsListPage } from '@harnessio/ui/views'

import mockConnectorsList from './mock-connectors-list.json'

const ConnectorsListPageWrapper = (): JSX.Element => {
  const [alertDeleteParams, setAlertDeleteParams] = useState('')
  const [isAlertDeleteDialogOpen, setIsAlertDeleteDialogOpen] = useState(false)

  const closeAlertDeleteDialog = () => setIsAlertDeleteDialogOpen(false)
  const openAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setIsAlertDeleteDialogOpen(true)
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
            isFavorite: connector.isFavorite
          })) as ConnectorListItem[]
        }
        useTranslationStore={useTranslationStore}
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
        onClose={closeAlertDeleteDialog}
        deleteFn={noop}
        error={null}
        type="connector"
        identifier={alertDeleteParams}
        useTranslationStore={useTranslationStore}
      />
    </>
  )
}

export { ConnectorsListPageWrapper }
