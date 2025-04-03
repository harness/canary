import { FC } from 'react'

import { SandboxLayout } from '@/views'

import { ConnectorDetailsHeader } from './connector-details-header'
import { ConnectorDetailsPageProps } from './types'

const ConnectorDetailsPage: FC<ConnectorDetailsPageProps> = ({ connectorDetails, useTranslationStore, onTest }) => {
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="h-full">
        <ConnectorDetailsHeader
          connectorDetails={connectorDetails}
          onTest={onTest}
          useTranslationStore={useTranslationStore}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorDetailsPage }
