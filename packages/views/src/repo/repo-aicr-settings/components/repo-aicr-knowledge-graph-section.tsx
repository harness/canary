import { FC, useMemo } from 'react'

import { Checkbox, Layout, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrApiError, AicrErrorType, AicrKnowledgeSource } from '../repo-aicr-settings.types'

export interface RepoAicrKnowledgeGraphSectionProps {
  value: string[]
  availableSources: AicrKnowledgeSource[]
  isLoading: boolean
  isUpdating: boolean
  apiError: AicrApiError | null
  onChange: (next: string[]) => void
}

export const RepoAicrKnowledgeGraphSection: FC<RepoAicrKnowledgeGraphSectionProps> = ({
  value,
  availableSources,
  isLoading,
  isUpdating,
  apiError,
  onChange
}) => {
  const { t } = useTranslation()
  const selected = useMemo(() => new Set(value), [value])

  const handleToggle = (identifier: string, checked: boolean) => {
    const next = new Set(selected)
    if (checked) next.add(identifier)
    else next.delete(identifier)
    onChange(Array.from(next))
  }

  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="2xs">
        <Text variant="heading-subsection" as="h3">
          {t('views:aicrSettings.knowledgeGraph.title', 'Knowledge Graph')}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {t(
            'views:aicrSettings.knowledgeGraph.description',
            'Select which Harness module data sources the agent can access for context-aware code reviews.'
          )}
        </Text>
      </Layout.Vertical>

      {isLoading ? (
        <Skeleton.Form linesCount={3} />
      ) : (
        <div className="rounded-cn-md grid grid-cols-1 gap-cn-sm border border-cn-2 p-cn-md sm:grid-cols-2">
          {availableSources.map(source => (
            <Checkbox
              key={source.identifier}
              id={`aicr-kg-${source.identifier}`}
              checked={selected.has(source.identifier)}
              onCheckedChange={checked => handleToggle(source.identifier, !!checked)}
              disabled={isUpdating || source.disabled}
              label={source.label}
            />
          ))}
        </div>
      )}

      {apiError?.type === AicrErrorType.UPDATE_KNOWLEDGE_GRAPH && <Text color="danger">{apiError.message}</Text>}
    </Layout.Vertical>
  )
}
