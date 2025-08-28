import { FC } from 'react'

import { Layout } from '@components/index'

import { ConnectorDetailsEntityFormView } from './connector-details-entity-form-view'
import { ConnectorDetailsConfigurationProps } from './types'

const ConnectorDetailsConfiguration: FC<ConnectorDetailsConfigurationProps> = ({
  connectorDetails,
  inputComponentFactory,
  getConnectorDefinition,
  apiError
}) => {
  return (
    <Layout.Vertical gap="2xl">
      <ConnectorDetailsEntityFormView
        connector={connectorDetails}
        inputComponentFactory={inputComponentFactory}
        getConnectorDefinition={getConnectorDefinition}
        apiError={apiError}
      />
    </Layout.Vertical>
  )
}

export { ConnectorDetailsConfiguration }
