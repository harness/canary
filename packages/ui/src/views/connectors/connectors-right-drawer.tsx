import { useCallback } from 'react'

import { TranslationStore } from '@/views'
import { Alert } from '@components/alert'
import { Sheet } from '@components/sheet'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import { ConnectorsProvider } from './context/connectors-context'
import {
  AnyConnectorDefinition,
  ConnectorEntityIntent,
  ConnectorFormEntityType,
  ConnectorRightDrawerMode,
  onSubmitProps
} from './types'

interface ConnectorsRightDrawerBaseProps {
  onFormSubmit?: (values: any) => void // TODO: TYPE this properly
  onDrawerClose?: () => void
  useSheet?: boolean // Whether to wrap content in Sheet.Root
  connectors: AnyConnectorDefinition[]
  getConnectorDefinition: (type: string) => AnyConnectorDefinition | undefined
  useTranslationStore: () => TranslationStore
  openSecretDrawer?: () => void
  apiError?: string | null
  intent: ConnectorEntityIntent
  formEntity: ConnectorFormEntityType | null
  setFormEntity: (value: ConnectorFormEntityType | null) => void
  rightDrawerMode: ConnectorRightDrawerMode
  setRightDrawerMode: (mode: ConnectorRightDrawerMode) => void
  connectorData?: any //TODO: type this to connector data
}

const ConnectorsRightDrawerBase = ({
  useSheet = false,
  onFormSubmit,
  connectors,
  getConnectorDefinition,
  onDrawerClose,
  useTranslationStore,
  openSecretDrawer,
  apiError,
  intent,
  formEntity,
  setFormEntity,
  rightDrawerMode,
  setRightDrawerMode,
  connectorData
}: ConnectorsRightDrawerBaseProps): JSX.Element => {
  const clearRightDrawerData = useCallback(() => {
    setRightDrawerMode(ConnectorRightDrawerMode.None)
    setFormEntity(null)
  }, [])

  const renderSheetContent = useCallback(() => {
    switch (rightDrawerMode) {
      case ConnectorRightDrawerMode.Collection:
        return (
          <ConnectorsPalette
            useTranslationStore={useTranslationStore}
            connectors={connectors}
            setRightDrawerMode={setRightDrawerMode}
            setFormEntity={setFormEntity}
            requestClose={() => {
              clearRightDrawerData()
              onDrawerClose?.()
            }}
          />
        )
      case ConnectorRightDrawerMode.Form:
        return formEntity ? (
          <ConnectorEntityForm
            openSecretDrawer={openSecretDrawer}
            useTranslationStore={useTranslationStore}
            formEntity={formEntity}
            setRightDrawerMode={setRightDrawerMode}
            requestClose={() => {
              clearRightDrawerData()
              onDrawerClose?.()
            }}
            onFormSubmit={onFormSubmit}
            apiError={apiError}
            getConnectorDefinition={getConnectorDefinition}
            intent={intent}
            connectorData={connectorData}
          />
        ) : (
          <></>
        )
      default:
        return <></>
    }
  }, [rightDrawerMode, setRightDrawerMode, setFormEntity, formEntity])

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
      <Sheet.Root
        open={rightDrawerMode !== ConnectorRightDrawerMode.None}
        onOpenChange={open => {
          if (!open) {
            setRightDrawerMode(ConnectorRightDrawerMode.None)
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
  useSheet = true,
  onFormSubmit,
  connectors,
  getConnectorDefinition,
  onDrawerClose,
  useTranslationStore,
  openSecretDrawer,
  apiError,
  intent,
  formEntity,
  setFormEntity,
  rightDrawerMode,
  setRightDrawerMode
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase
        useSheet={useSheet}
        onFormSubmit={onFormSubmit}
        connectors={connectors}
        getConnectorDefinition={getConnectorDefinition}
        onDrawerClose={onDrawerClose}
        useTranslationStore={useTranslationStore}
        openSecretDrawer={openSecretDrawer}
        apiError={apiError}
        intent={intent}
        formEntity={formEntity}
        setFormEntity={setFormEntity}
        rightDrawerMode={rightDrawerMode}
        setRightDrawerMode={setRightDrawerMode}
      />
    </ConnectorsProvider>
  )
}

// Use this when you need a standalone component with its own context
const ConnectorsRightDrawerWithProvider = ({
  useSheet = true,
  connectors,
  getConnectorDefinition,
  useTranslationStore,
  intent,
  formEntity,
  setFormEntity,
  rightDrawerMode,
  setRightDrawerMode
}: ConnectorsRightDrawerBaseProps): JSX.Element | null => {
  return (
    <ConnectorsProvider>
      <ConnectorsRightDrawerBase
        useSheet={useSheet}
        connectors={connectors}
        getConnectorDefinition={getConnectorDefinition}
        useTranslationStore={useTranslationStore}
        intent={intent}
        formEntity={formEntity}
        setFormEntity={setFormEntity}
        rightDrawerMode={rightDrawerMode}
        setRightDrawerMode={setRightDrawerMode}
      />
    </ConnectorsProvider>
  )
}

export { ConnectorsRightDrawer, ConnectorsRightDrawerWithProvider }
