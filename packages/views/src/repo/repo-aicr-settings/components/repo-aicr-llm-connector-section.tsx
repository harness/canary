import { FC, useMemo } from 'react'

import { Layout, Select, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrApiError, AicrConnectorRef, AicrErrorType } from '../repo-aicr-settings.types'

export interface RepoAicrLlmConnectorSectionProps {
  value: AicrConnectorRef | null
  availableConnectors: AicrConnectorRef[]
  isLoading: boolean
  isUpdating: boolean
  apiError: AicrApiError | null
  onChange: (next: AicrConnectorRef | null) => void
}

export const RepoAicrLlmConnectorSection: FC<RepoAicrLlmConnectorSectionProps> = ({
  value,
  availableConnectors,
  isLoading,
  isUpdating,
  apiError,
  onChange
}) => {
  const { t } = useTranslation()

  const options = useMemo(
    () => availableConnectors.map(connector => ({ label: connector.name, value: connector.identifier })),
    [availableConnectors]
  )

  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="2xs">
        <Text variant="heading-subsection" as="h3">
          {t('views:aicrSettings.llmConnector.title', 'LLM Connector')}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {t('views:aicrSettings.llmConnector.description', 'Select the LLM connector used by the code review agent.')}
        </Text>
      </Layout.Vertical>

      {isLoading ? (
        <Skeleton.Form linesCount={1} />
      ) : (
        <Select
          options={options}
          value={value?.identifier ?? null}
          onChange={selected => {
            const next = availableConnectors.find(connector => connector.identifier === selected) ?? null
            onChange(next)
          }}
          placeholder={t('views:aicrSettings.llmConnector.placeholder', 'Select a connector')}
          disabled={isUpdating}
          size="md"
        />
      )}

      {apiError?.type === AicrErrorType.UPDATE_LLM_CONNECTOR && <Text color="danger">{apiError.message}</Text>}
    </Layout.Vertical>
  )
}
