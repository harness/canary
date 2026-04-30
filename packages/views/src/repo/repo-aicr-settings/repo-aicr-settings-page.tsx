import { FC, ReactNode } from 'react'

import { FormSeparator, Layout, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

import { RepoAicrAgentSection } from './components/repo-aicr-agent-section'
import { RepoAicrAgentSkillsSection } from './components/repo-aicr-agent-skills-section'
import { RepoAicrKnowledgeGraphSection } from './components/repo-aicr-knowledge-graph-section'
import { RepoAicrLlmConnectorSection } from './components/repo-aicr-llm-connector-section'
import { RepoAicrSuccessCriteriaSection } from './components/repo-aicr-success-criteria-section'
import { RepoAicrSystemPromptSection } from './components/repo-aicr-system-prompt-section'
import {
  DEFAULT_AICR_AGENT_SKILLS,
  DEFAULT_AICR_KNOWLEDGE_SOURCES,
  DEFAULT_AICR_SUCCESS_CRITERIA,
  DEFAULT_AICR_SYSTEM_PROMPT
} from './repo-aicr-settings.constants'
import {
  AicrAgentRef,
  AicrAgentSkillRef,
  AicrApiError,
  AicrConnectorRef,
  AicrCriterion,
  AicrLoadingStates,
  IRepoAicrStore
} from './repo-aicr-settings.types'

export interface RepoAicrSettingsPageProps {
  /** Store hook supplied by host (codev2 / platformUI). */
  useRepoAicrSettingsStore: () => IRepoAicrStore

  loadingStates: AicrLoadingStates
  apiError: AicrApiError | null

  handleUpdateSuccessCriteria: (criteria: AicrCriterion[]) => void
  handleUpdateLlmConnector: (ref: AicrConnectorRef | null) => void
  handleUpdateAgent: (ref: AicrAgentRef | null) => void
  handleUpdateKnowledgeGraph: (sourceIds: string[]) => void
  handleUpdateSystemPrompt: (prompt: string) => void
  handleUpdateAgentSkills: (skills: AicrAgentSkillRef[]) => void

  /** Optional: shows a "Create custom agent" affordance next to the agent picker. */
  onCreateCustomAgent?: () => void

  /** Right-side header slot — typically a "View Analytics" button injected by the host. */
  headerActions?: ReactNode
}

export const RepoAicrSettingsPage: FC<RepoAicrSettingsPageProps> = ({
  useRepoAicrSettingsStore,
  loadingStates,
  apiError,
  handleUpdateSuccessCriteria,
  handleUpdateLlmConnector,
  handleUpdateAgent,
  handleUpdateKnowledgeGraph,
  handleUpdateSystemPrompt,
  handleUpdateAgentSkills,
  onCreateCustomAgent,
  headerActions
}) => {
  const { t } = useTranslation()
  const { settings, availableConnectors, availableAgents, availableKnowledgeSources, availableAgentSkills } =
    useRepoAicrSettingsStore()

  const successCriteria = settings?.successCriteria ?? DEFAULT_AICR_SUCCESS_CRITERIA
  const llmConnector = settings?.llmConnectorRef ?? null
  const agent = settings?.agentRef ?? null
  const knowledgeSources = settings?.knowledgeSources ?? []
  const systemPrompt = settings?.systemPrompt ?? DEFAULT_AICR_SYSTEM_PROMPT
  const agentSkills = settings?.agentSkills ?? DEFAULT_AICR_AGENT_SKILLS

  const knowledgeSourceCatalog =
    availableKnowledgeSources.length > 0 ? availableKnowledgeSources : DEFAULT_AICR_KNOWLEDGE_SOURCES
  const agentSkillsCatalog = availableAgentSkills.length > 0 ? availableAgentSkills : DEFAULT_AICR_AGENT_SKILLS

  return (
    <Layout.Vertical className="settings-form-width" gap="xl">
      <Layout.Flex justify="between" align="start" gapX="md">
        <Layout.Vertical gap="2xs">
          <Text as="h1" variant="heading-section">
            {t('views:aicrSettings.title', 'AI Code Review')}
          </Text>
          <Text variant="body-normal" color="foreground-3">
            {t(
              'views:aicrSettings.description',
              'Configure the AI-powered code review agent for pull requests in this repository.'
            )}
          </Text>
        </Layout.Vertical>
        {headerActions}
      </Layout.Flex>

      <Layout.Vertical gap="xl">
        <RepoAicrSuccessCriteriaSection
          criteria={successCriteria}
          isLoading={loadingStates.isLoadingSettings}
          isUpdating={loadingStates.isUpdatingSuccessCriteria}
          apiError={apiError}
          onChangeCriteria={handleUpdateSuccessCriteria}
        />
        <FormSeparator />
        <RepoAicrLlmConnectorSection
          value={llmConnector}
          availableConnectors={availableConnectors}
          isLoading={loadingStates.isLoadingSettings}
          isUpdating={loadingStates.isUpdatingLlmConnector}
          apiError={apiError}
          onChange={handleUpdateLlmConnector}
        />
        <FormSeparator />
        <RepoAicrAgentSection
          value={agent}
          availableAgents={availableAgents}
          isLoading={loadingStates.isLoadingSettings}
          isUpdating={loadingStates.isUpdatingAgent}
          apiError={apiError}
          onChange={handleUpdateAgent}
          onCreateCustomAgent={onCreateCustomAgent}
        />
        <FormSeparator />
        <RepoAicrKnowledgeGraphSection
          value={knowledgeSources}
          availableSources={knowledgeSourceCatalog}
          isLoading={loadingStates.isLoadingSettings}
          isUpdating={loadingStates.isUpdatingKnowledgeGraph}
          apiError={apiError}
          onChange={handleUpdateKnowledgeGraph}
        />
        <FormSeparator />
        <RepoAicrSystemPromptSection
          value={systemPrompt}
          isLoading={loadingStates.isLoadingSettings}
          isUpdating={loadingStates.isUpdatingSystemPrompt}
          apiError={apiError}
          onSubmit={handleUpdateSystemPrompt}
        />
        <FormSeparator />
        <RepoAicrAgentSkillsSection
          value={agentSkills}
          availableSkills={agentSkillsCatalog}
          isLoading={loadingStates.isLoadingSettings}
          isUpdating={loadingStates.isUpdatingAgentSkills}
          apiError={apiError}
          onChange={handleUpdateAgentSkills}
        />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
