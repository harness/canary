import { FC } from 'react'

import { Layout } from '@/components'

import { ConnectorEntityForm } from '../connector-entity-form'
import { EntityIntent } from '../types'
import { ConnectorDetailsConfigurationProps } from './types'

const ConnectorDetailsConfiguration: FC<ConnectorDetailsConfigurationProps> = ({
  connectorDetails,
  onSave,
  inputComponentFactory,
  getConnectorDefinition,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  return (
    <Layout.Vertical className="mt-2.5">
      <p className="max-w-xl text-14 leading-snug text-foreground-2">{t('views:common.details', 'Details')}</p>
      <ConnectorEntityForm
        connector={connectorDetails}
        intent={EntityIntent.EDIT}
        useTranslationStore={useTranslationStore}
        onFormSubmit={onSave}
        inputComponentFactory={inputComponentFactory}
        getConnectorDefinition={getConnectorDefinition}
        autoExpandGroup
      />
    </Layout.Vertical>
  )
}

export { ConnectorDetailsConfiguration }
