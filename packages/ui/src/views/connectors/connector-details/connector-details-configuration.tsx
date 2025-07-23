import { FC } from 'react'

import { Layout, Text } from '@/components'
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
    <Layout.Vertical gap="xl">
      <Text as="h1" variant="heading-subsection">
        {t('views:common.details', 'Details')}
      </Text>
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
