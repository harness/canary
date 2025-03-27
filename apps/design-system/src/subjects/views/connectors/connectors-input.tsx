import { useState } from 'react'

import { StyledLink } from '@harnessio/ui/components'
import { ConnectorInput, ConnectorItem } from '@harnessio/ui/views'

import { ConnectorsRefPage } from './connectors-ref'

export const ConnectorInputExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null)

  return (
    <>
      <ConnectorInput
        placeholder={<StyledLink to="#">Please select a connector</StyledLink>}
        value={selectedConnector}
        onClick={() => {
          setIsDrawerOpen(true)
        }}
        onEdit={() => {
          setIsDrawerOpen(true)
        }}
        onClear={() => setSelectedConnector(null)}
        renderValue={connector => connector.name}
      />
      <ConnectorsRefPage
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedConnector={selectedConnector}
        setSelectedConnector={setSelectedConnector}
      />
    </>
  )
}
