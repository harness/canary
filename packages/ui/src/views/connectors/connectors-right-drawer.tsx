import { useCallback, useEffect } from 'react'

import { TranslationStore } from '@/views'
import { Alert } from '@components/alert'
import { Drawer } from '@components/drawer'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import { ConnectorsProvider, useConnectorsContext } from './context/connectors-context'
import { AnyConnectorDefinition, ConnectorRightDrawer, onSubmitProps } from './types'

interface ConnectorsRightDrawerBaseProps {
  initialDrawerState?: ConnectorRightDrawer
  onFormSubmit?: (values: onSubmitProps) => void
  onDrawerClose?: () => void
  useSheet?: boolean // Whether to wrap content in Sheet.Root
  connectors: AnyConnectorDefinition[]
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  useTranslationStore: () => TranslationStore
  openSecretDrawer?: () => void
  apiError?: string | null
  children?: React.ReactNode
}

const ConnectorsRightDrawerBase = ({
  initialDrawerState,
  useSheet = false,
  onFormSubmit,
  connectors,
  getConnectorDefinition,
  onDrawerClose,
  useTranslationStore,
  openSecretDrawer,
  apiError,
  children
}: ConnectorsRightDrawerBaseProps): JSX.Element => {
  const { rightDrawer, setRightDrawer, formEntity, setFormEntity, clearRightDrawerData } = useConnectorsContext()

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
            useTranslationStore={useTranslationStore}
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
            openSecretDrawer={openSecretDrawer}
            useTranslationStore={useTranslationStore}
            formEntity={formEntity}
            setRightDrawer={setRightDrawer}
            requestClose={() => {
              clearRightDrawerData()
              onDrawerClose?.()
            }}
            onFormSubmit={onFormSubmit}
            apiError={apiError}
            getConnectorDefinition={getConnectorDefinition}
          />
        ) : (
          <></>
        )
      default:
        return <></>
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      <Drawer.Root
        open={rightDrawer !== ConnectorRightDrawer.None}
        onOpenChange={open => {
          if (!open) {
            setRightDrawer(ConnectorRightDrawer.None)
          }
        }}
      >
        <Drawer.Content onOpenAutoFocus={e => e.preventDefault()} className="max-w-lg p-0 sm:max-w-lg">
          {content}
          {children}
        </Drawer.Content>
      </Drawer.Root>
      {apiError && (
        <Alert.Container variant="destructive" className="mb-8">
          <Alert.Description>{apiError?.toString()}</Alert.Description>
        </Alert.Container>
      )}
    </>
  )
}

// Use this when you need to provide your own context
const ConnectorsRightDrawer = ({
  initialDrawerState = ConnectorRightDrawer.Collection,
  useSheet = true,
  onFormSubmit,
  connectors,
  getConnectorDefinition,
  onDrawerClose,
  useTranslationStore,
  openSecretDrawer,
  apiError,
  children
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
        useTranslationStore={useTranslationStore}
        openSecretDrawer={openSecretDrawer}
        apiError={apiError}
      >
        {children}
      </ConnectorsRightDrawerBase>
    </ConnectorsProvider>
  )
}

// Use this when you need a standalone component with its own context
const ConnectorsRightDrawerWithProvider = ({
  initialDrawerState,
  useSheet = true,
  connectors,
  getConnectorDefinition,
  useTranslationStore,
  children
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase
        initialDrawerState={initialDrawerState}
        useSheet={useSheet}
        connectors={connectors}
        getConnectorDefinition={getConnectorDefinition}
        useTranslationStore={useTranslationStore}
      >
        {children}
      </ConnectorsRightDrawerBase>
    </ConnectorsProvider>
  )
}

export { ConnectorsRightDrawer, ConnectorsRightDrawerWithProvider }