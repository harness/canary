import { FC, useMemo } from 'react'

import { Layout, MultiSelect, MultiSelectOption, Skeleton, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { AicrAgentSkillRef, AicrApiError, AicrErrorType } from '../repo-aicr-settings.types'

export interface RepoAicrAgentSkillsSectionProps {
  value: AicrAgentSkillRef[]
  availableSkills: AicrAgentSkillRef[]
  isLoading: boolean
  isUpdating: boolean
  apiError: AicrApiError | null
  onChange: (next: AicrAgentSkillRef[]) => void
}

const toOption = (skill: AicrAgentSkillRef): MultiSelectOption => ({
  id: skill.identifier,
  key: skill.label,
  value: skill.identifier
})

const toSkill = (option: MultiSelectOption): AicrAgentSkillRef => ({
  identifier: String(option.id),
  label: option.key
})

/**
 * Renders the agent skills as a tag-style multi-select picker — visually and
 * behaviourally consistent with the Tags input in the repo General Settings page.
 * Users select skills from a fixed catalog supplied by the host (no free-form creation).
 */
export const RepoAicrAgentSkillsSection: FC<RepoAicrAgentSkillsSectionProps> = ({
  value,
  availableSkills,
  isLoading,
  isUpdating,
  apiError,
  onChange
}) => {
  const { t } = useTranslation()

  const selectedOptions = useMemo(() => value.map(toOption), [value])
  const catalogOptions = useMemo(() => availableSkills.map(toOption), [availableSkills])

  const handleChange = (next: MultiSelectOption[]) => {
    onChange(next.map(toSkill))
  }

  return (
    <Layout.Vertical gap="md">
      <Layout.Vertical gap="2xs">
        <Text variant="heading-subsection" as="h3">
          {t('views:aicrSettings.agentSkills.title', 'Agent Skills')}
        </Text>
        <Text variant="body-normal" color="foreground-3">
          {t(
            'views:aicrSettings.agentSkills.description',
            'Select the skills available to the code review agent. More skills give the agent greater capability but may increase review time.'
          )}
        </Text>
      </Layout.Vertical>

      {isLoading ? (
        <Skeleton.Form linesCount={2} />
      ) : (
        <MultiSelect
          placeholder={t('views:aicrSettings.agentSkills.placeholder', 'Add skills')}
          value={selectedOptions}
          options={catalogOptions}
          onChange={handleChange}
          disabled={isUpdating}
          disallowCreation
        />
      )}

      {apiError?.type === AicrErrorType.UPDATE_AGENT_SKILLS && <Text color="danger">{apiError.message}</Text>}
    </Layout.Vertical>
  )
}
