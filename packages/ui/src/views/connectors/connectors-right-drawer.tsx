import { useCallback, useEffect } from 'react'

import { Sheet } from '@components/sheet'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import { ConnectorsProvider, useConnectorsContext } from './context/connectors-context'
import { AnyConnectorDefinition, ConnectorRightDrawer } from './types'

interface ConnectorsRightDrawerBaseProps {
  initialDrawerState?: ConnectorRightDrawer
  onFormSubmit?: (values: any) => void // TODO: TYPE this properly
  onDrawerClose?: () => void
  useSheet?: boolean // Whether to wrap content in Sheet.Root
  connectors: any //TODO: TYPE
  getConnectorDefinition: (identifier: string) => AnyConnectorDefinition | undefined
}

const ConnectorsRightDrawerBase = ({
  initialDrawerState,
  useSheet = false,
  onFormSubmit,
  connectors,
  getConnectorDefinition,
  onDrawerClose
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
            connectors={connectors}
            setRightDrawer={setRightDrawer}
            setFormEntity={setFormEntity}
            requestClose={() => {
              clearRightDrawerData()
              onDrawerClose?.()
            }}
          />
        )
      case ConnectorRightDrawer.Form:
        return formEntity ? (
          <ConnectorEntityForm
            formEntity={formEntity}
            setRightDrawer={setRightDrawer}
            requestClose={() => {
              clearRightDrawerData()
              onDrawerClose?.()
            }}
            onFormSubmit={onFormSubmit}
            getConnectorDefinition={getConnectorDefinition}
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
  useSheet = true,
  onFormSubmit,
  connectors,
  getConnectorDefinition,
  onDrawerClose
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase
        initialDrawerState={initialDrawerState}
        useSheet={useSheet}
        onFormSubmit={onFormSubmit}
        connectors={connectors}
        getConnectorDefinition={getConnectorDefinition}
        onDrawerClose={onDrawerClose}
      />
    </ConnectorsProvider>
  )
}

// Use this when you need a standalone component with its own context
const ConnectorsRightDrawerWithProvider = ({
  initialDrawerState,
  useSheet = true,
  connectors,
  getConnectorDefinition
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase
        initialDrawerState={initialDrawerState}
        useSheet={useSheet}
        connectors={connectors}
        getConnectorDefinition={getConnectorDefinition}
      />
    </ConnectorsProvider>
  )
}

export { ConnectorsRightDrawer, ConnectorsRightDrawerWithProvider }
