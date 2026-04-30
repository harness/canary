import { FC, useCallback } from 'react'

import { Layout, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrCriterionEditorFields, deriveAicrCriterionIdentifier } from '../repo-aicr-settings.schema'
import { AicrApiError, AicrCriterion, AicrErrorType } from '../repo-aicr-settings.types'
import { RepoAicrSuccessCriteriaEditor } from './repo-aicr-success-criteria-editor'
import { RepoAicrSuccessCriteriaList } from './repo-aicr-success-criteria-list'

export interface RepoAicrSuccessCriteriaSectionProps {
  criteria: AicrCriterion[]
  isLoading: boolean
  isUpdating: boolean
  apiError: AicrApiError | null
  onChangeCriteria: (next: AicrCriterion[]) => void
}

export const RepoAicrSuccessCriteriaSection: FC<RepoAicrSuccessCriteriaSectionProps> = ({
  criteria,
  isLoading,
  isUpdating,
  apiError,
  onChangeCriteria
}) => {
  const { t } = useTranslation()

  const handleAdd = useCallback(
    (fields: AicrCriterionEditorFields) => {
      const baseIdentifier = deriveAicrCriterionIdentifier(fields.display)
      const existingIds = new Set(criteria.map(c => c.identifier))
      let identifier = baseIdentifier
      let suffix = 2
      while (existingIds.has(identifier)) {
        identifier = `${baseIdentifier}_${suffix++}`
      }

      const next: AicrCriterion[] = [
        ...criteria,
        {
          identifier,
          display: fields.display,
          prompt: fields.prompt,
          severity: criteria[0]?.severity ?? ('suggestive' as AicrCriterion['severity']),
          enabled: true,
          bypass: true,
          githubCheck: false
        }
      ]
      onChangeCriteria(next)
    },
    [criteria, onChangeCriteria]
  )

  const handleToggle = useCallback(
    (identifier: string, enabled: boolean) => {
      onChangeCriteria(criteria.map(c => (c.identifier === identifier ? { ...c, enabled } : c)))
    },
    [criteria, onChangeCriteria]
  )

  const handleDelete = useCallback(
    (identifier: string) => {
      onChangeCriteria(criteria.filter(c => c.identifier !== identifier))
    },
    [criteria, onChangeCriteria]
  )

  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="2xs">
        <Text variant="heading-subsection" as="h3">
          {t('views:aicrSettings.successCriteria.title', 'Success Criteria')}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {t(
            'views:aicrSettings.successCriteria.description',
            'Define the checks the code review agent will evaluate on each pull request.'
          )}
        </Text>
      </Layout.Vertical>

      {isLoading ? (
        <Skeleton.List />
      ) : (
        <Layout.Vertical gap="md">
          <RepoAicrSuccessCriteriaList
            criteria={criteria}
            disabled={isUpdating}
            onToggleCriterion={handleToggle}
            onDeleteCriterion={handleDelete}
          />
          <RepoAicrSuccessCriteriaEditor isSubmitting={isUpdating} onSubmit={handleAdd} />
        </Layout.Vertical>
      )}

      {apiError?.type === AicrErrorType.UPDATE_SUCCESS_CRITERIA && <Text color="danger">{apiError.message}</Text>}
    </Layout.Vertical>
  )
}
