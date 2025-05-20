import { FC } from 'react'

import { Layout } from '@/components'
import { useTranslation } from '@/context'

import { ConnectorEntityForm } from '../connector-entity-form'
import { EntityIntent } from '../types'
import { ConnectorDetailsConfigurationProps } from './types'

const ConnectorDetailsConfiguration: FC<ConnectorDetailsConfigurationProps> = ({
  connectorDetails,
  onSave,
  inputComponentFactory,
  getConnectorDefinition,
  apiError
}) => {
  const { t } = useTranslation()
  return (
    <Layout.Vertical gap="space-y-8">
      <h1 className="text-5 font-medium leading-snug tracking-tight text-cn-foreground-1">
        {t('views:common.details', 'Details')}
      </h1>
      <ConnectorEntityForm
        connector={connectorDetails}
        intent={EntityIntent.EDIT}
        onFormSubmit={onSave}
        inputComponentFactory={inputComponentFactory}
        getConnectorDefinition={getConnectorDefinition}
        apiError={apiError}
      />
    </Layout.Vertical>
  )
}

export { ConnectorDetailsConfiguration }
