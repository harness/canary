import { useCallback, useEffect } from 'react'

import { Sheet } from '@components/sheet'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import { ConnectorsProvider, useConnectorsContext } from './context/connectors-context'
import { ConnectorRightDrawer } from './types'

interface ConnectorsRightDrawerBaseProps {
  initialDrawerState?: ConnectorRightDrawer
  standalone?: boolean
  onFormSubmit?: (values: any) => void // TODO: TYPE this properly
  useSheet?: boolean // Whether to wrap content in Sheet.Root
}

const ConnectorsRightDrawerBase = ({
  initialDrawerState,
  useSheet = false,
  onFormSubmit
}: ConnectorsRightDrawerBaseProps): JSX.Element => {
  const { rightDrawer, setRightDrawer, formEntity, setFormEntity, clearRightDrawerData } = useConnectorsContext()
  console.log(rightDrawer, formEntity)

  useEffect(() => {
    if (initialDrawerState) {
      setRightDrawer(initialDrawerState)
    }
  }, [initialDrawerState, setRightDrawer])

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
            onFormSubmit={onFormSubmit}
          />
        ) : (
          <></>
        )
      default:
        return <></>
    }
  }, [rightDrawer, setRightDrawer, setFormEntity, formEntity])

  const content = renderSheetContent()

  if (!useSheet) {
    // When used inside an existing drawer, just return the content
    return content
  }

  // When used as a standalone sheet
  if (!content) {
    return <></>
  }

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
        {content}
      </Sheet.Content>
    </Sheet.Root>
  )
}

// Use this when you need to provide your own context
const ConnectorsRightDrawer = ({
  initialDrawerState = ConnectorRightDrawer.Collection,
  useSheet = false,
  onFormSubmit
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase
        initialDrawerState={initialDrawerState}
        useSheet={useSheet}
        onFormSubmit={onFormSubmit}
      />
    </ConnectorsProvider>
  )
}

// Use this when you need a standalone component with its own context
const ConnectorsRightDrawerWithProvider = ({
  initialDrawerState,
  useSheet = true
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase initialDrawerState={initialDrawerState} useSheet={useSheet} />
    </ConnectorsProvider>
  )
}

export { ConnectorsRightDrawer, ConnectorsRightDrawerWithProvider }
