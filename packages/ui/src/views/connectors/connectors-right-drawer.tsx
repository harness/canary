import { useCallback } from 'react'

import { TranslationStore } from '@/views'
import { Alert } from '@components/alert'

import { ConnectorEntityForm } from './connector-entity-form'
import { ConnectorsPalette } from './connectors-pallete-drawer'
import {
  AnyConnectorDefinition,
  ConnectorEntityIntent,
  ConnectorFormEntityType,
  ConnectorRightDrawerMode
} from './types'
import { Drawer } from '@components/drawer'

interface ConnectorsRightDrawerBaseProps {
  onFormSubmit?: (values: any) => void // TODO: TYPE this properly
  onDrawerClose?: () => void
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

export const ConnectorsRightDrawer = ({
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

  if (!content) {
    return <></>
  }

  return (
    <>
      <Drawer.Root
        nested
        open={rightDrawerMode !== ConnectorRightDrawerMode.None}
        onOpenChange={open => {
          if (!open) {
            setRightDrawerMode(ConnectorRightDrawerMode.None)
          }
        }}
      >
        <Drawer.Content
          onOpenAutoFocus={e => e.preventDefault()}
          // hideCloseButton={true}
          className="max-w-lg p-0 sm:max-w-lg"
        >
          {content}
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
