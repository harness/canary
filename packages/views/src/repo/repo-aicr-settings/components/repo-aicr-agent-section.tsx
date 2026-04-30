import { FC, useMemo } from 'react'

import { Button, IconV2, Layout, Select, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrAgentRef, AicrApiError, AicrErrorType } from '../repo-aicr-settings.types'

export interface RepoAicrAgentSectionProps {
  value: AicrAgentRef | null
  availableAgents: AicrAgentRef[]
  isLoading: boolean
  isUpdating: boolean
  apiError: AicrApiError | null
  onChange: (next: AicrAgentRef | null) => void
  onCreateCustomAgent?: () => void
}

export const RepoAicrAgentSection: FC<RepoAicrAgentSectionProps> = ({
  value,
  availableAgents,
  isLoading,
  isUpdating,
  apiError,
  onChange,
  onCreateCustomAgent
}) => {
  const { t } = useTranslation()

  const options = useMemo(
    () => availableAgents.map(agent => ({ label: agent.name, value: agent.identifier })),
    [availableAgents]
  )

  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="2xs">
        <Text variant="heading-subsection" as="h3">
          {t('views:aicrSettings.agent.title', 'Agent')}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {t('views:aicrSettings.agent.description', 'Select a pre-configured agent or create a custom one.')}
        </Text>
      </Layout.Vertical>

      {isLoading ? (
        <Skeleton.Form linesCount={1} />
      ) : (
        <Layout.Flex gapX="sm" align="center">
          <div className="flex-1">
            <Select
              options={options}
              value={value?.identifier ?? null}
              onChange={selected => {
                const next = availableAgents.find(agent => agent.identifier === selected) ?? null
                onChange(next)
              }}
              placeholder={t('views:aicrSettings.agent.placeholder', 'Select an agent')}
              disabled={isUpdating}
              size="md"
            />
          </div>
          {onCreateCustomAgent && (
            <Button variant="secondary" onClick={onCreateCustomAgent} disabled={isUpdating}>
              <IconV2 name="plus" size="sm" />
              {t('views:aicrSettings.agent.createCustom', 'Create custom code review agent')}
            </Button>
          )}
        </Layout.Flex>
      )}

      {apiError?.type === AicrErrorType.UPDATE_AGENT && <Text color="danger">{apiError.message}</Text>}
    </Layout.Vertical>
  )
}
