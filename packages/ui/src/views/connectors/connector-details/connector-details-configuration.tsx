import { FC } from 'react'

import { SandboxLayout } from '@/views'

import { ConnectorDetailsEntityFormView } from './connector-details-entity-form-view'
import { ConnectorDetailsConfigurationProps } from './types'

const ConnectorDetailsConfiguration: FC<ConnectorDetailsConfigurationProps> = ({
  connectorDetails,
  inputComponentFactory,
  getConnectorDefinition,
  apiError
}) => {
  return (
    <SandboxLayout.Content className="h-full px-0">
      <ConnectorDetailsEntityFormView
        connector={connectorDetails}
        inputComponentFactory={inputComponentFactory}
        getConnectorDefinition={getConnectorDefinition}
        apiError={apiError}
      />
    </SandboxLayout.Content>
  )
}

export { ConnectorDetailsConfiguration }
