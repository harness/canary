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
  useTranslationStore,
  apiError
}) => {
  const { t } = useTranslationStore()
  return (
    <Layout.Vertical className="mt-2.5">
      <h1 className="text-20 font-medium leading-snug tracking-tight text-cn-foreground-1">
        {t('views:common.details', 'Details')}
      </h1>
      <ConnectorEntityForm
        connector={connectorDetails}
        intent={EntityIntent.EDIT}
        useTranslationStore={useTranslationStore}
        onFormSubmit={onSave}
        inputComponentFactory={inputComponentFactory}
        getConnectorDefinition={getConnectorDefinition}
        apiError={apiError}
      />
    </Layout.Vertical>
  )
}

export { ConnectorDetailsConfiguration }
