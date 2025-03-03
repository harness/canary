import { FC, useCallback, useState } from 'react'

import { Sheet } from '@components/sheet'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import { ConnectorFormEntityType, ConnectorRightDrawer } from './types'

export interface ConnectorsRightDrawerProps {
  rightDrawer: ConnectorRightDrawer
  setRightDrawer: (value: ConnectorRightDrawer) => void
}

export const ConnectorsRightDrawer: FC<ConnectorsRightDrawerProps> = ({ rightDrawer, setRightDrawer }) => {
  const [formEntity, setFormEntity] = useState<ConnectorFormEntityType | null>(null)
  const renderSheetContent = useCallback(() => {
    switch (rightDrawer) {
      case ConnectorRightDrawer.Collection:
        return (
          <ConnectorsPalette
            setRightDrawer={setRightDrawer}
            setFormEntity={setFormEntity}
            requestClose={() => {
              setRightDrawer(ConnectorRightDrawer.None)
            }}
          />
        )
      case ConnectorRightDrawer.Form:
        return (
          <ConnectorEntityForm
            formEntity={formEntity}
            requestClose={() => {
              setRightDrawer(ConnectorRightDrawer.None)
            }}
          />
        )
      default:
        return null
    }
  }, [rightDrawer])

  return (
    <Sheet.Root
      open={rightDrawer !== ConnectorRightDrawer.None}
      onOpenChange={open => {
        if (!open) {
          setRightDrawer(ConnectorRightDrawer.None)
        }
      }}
    >
      <Sheet.Content
        onOpenAutoFocus={e => e.preventDefault()}
        hideCloseButton={true}
        className="max-w-lg p-0 sm:max-w-lg"
      >
        {renderSheetContent()}
      </Sheet.Content>
    </Sheet.Root>
  )
}
