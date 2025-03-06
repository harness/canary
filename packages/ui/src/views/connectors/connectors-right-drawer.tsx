import { useCallback } from 'react'

import { Sheet } from '@components/sheet'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import { ConnectorRightDrawer } from './types'
import { useConnectorsContext } from './context/connectors-context'

export const ConnectorsRightDrawer = (): JSX.Element => {
  const { rightDrawer, setRightDrawer, formEntity, setFormEntity, clearRightDrawerData } = useConnectorsContext()
  
  const renderSheetContent = useCallback(() => {
    switch (rightDrawer) {
      case ConnectorRightDrawer.Collection:
        return (
          <ConnectorsPalette
            setRightDrawer={setRightDrawer}
            setFormEntity={setFormEntity}
            requestClose={() => {
              clearRightDrawerData()
            }}
          />
        )
      case ConnectorRightDrawer.Form:
        return formEntity ? (
          <ConnectorEntityForm
            formEntity={formEntity}
            requestClose={() => {
              clearRightDrawerData()
            }}
          />
        ) : null
      default:
        return null
    }
  }, [rightDrawer, setRightDrawer, setFormEntity, formEntity])

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
