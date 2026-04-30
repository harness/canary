import { useEffect } from 'react'

import {
  AicrAgentRef,
  AicrAgentSkillRef,
  AicrConnectorRef,
  AicrCriterion,
  AicrSettings,
  DEFAULT_AICR_AGENT_SKILLS,
  DEFAULT_AICR_KNOWLEDGE_SOURCES,
  DEFAULT_AICR_SUCCESS_CRITERIA,
  DEFAULT_AICR_SYSTEM_PROMPT,
  RepoAicrSettingsPage
} from '@harnessio/views'

import { useRepoAicrSettingsStore } from './stores/repo-aicr-settings-store'

/**
 * Per-repo AI Code Review settings container.
 *
 * Backend APIs are not finalized yet — this container seeds the store with
 * sensible defaults and persists user edits in local zustand state only.
 * Replace each handler with an API mutation once swaggers are available.
 */
export const RepoSettingsAicrContainer = () => {
  const {
    settings,
    setSettings,
    setAvailableConnectors,
    setAvailableAgents,
    setAvailableKnowledgeSources,
    setAvailableAgentSkills
  } = useRepoAicrSettingsStore()

  useEffect(() => {
    if (settings) return

    setSettings({
      successCriteria: DEFAULT_AICR_SUCCESS_CRITERIA,
      llmConnectorRef: null,
      agentRef: null,
      knowledgeSources: [],
      systemPrompt: DEFAULT_AICR_SYSTEM_PROMPT,
      agentSkills: DEFAULT_AICR_AGENT_SKILLS
    })
    setAvailableConnectors([])
    setAvailableAgents([])
    setAvailableKnowledgeSources(DEFAULT_AICR_KNOWLEDGE_SOURCES)
    setAvailableAgentSkills(DEFAULT_AICR_AGENT_SKILLS)
  }, [
    settings,
    setSettings,
    setAvailableConnectors,
    setAvailableAgents,
    setAvailableKnowledgeSources,
    setAvailableAgentSkills
  ])

  const updateSettings = (patch: Partial<AicrSettings>) => {
    const current = useRepoAicrSettingsStore.getState().settings
    if (!current) return
    setSettings({ ...current, ...patch })
  }

  const handleUpdateSuccessCriteria = (criteria: AicrCriterion[]) => updateSettings({ successCriteria: criteria })
  const handleUpdateLlmConnector = (ref: AicrConnectorRef | null) => updateSettings({ llmConnectorRef: ref })
  const handleUpdateAgent = (ref: AicrAgentRef | null) => updateSettings({ agentRef: ref })
  const handleUpdateKnowledgeGraph = (sourceIds: string[]) => updateSettings({ knowledgeSources: sourceIds })
  const handleUpdateSystemPrompt = (prompt: string) => updateSettings({ systemPrompt: prompt })
  const handleUpdateAgentSkills = (skills: AicrAgentSkillRef[]) => updateSettings({ agentSkills: skills })

  const loadingStates = {
    isLoadingSettings: false,
    isUpdatingSuccessCriteria: false,
    isUpdatingLlmConnector: false,
    isUpdatingAgent: false,
    isUpdatingKnowledgeGraph: false,
    isUpdatingSystemPrompt: false,
    isUpdatingAgentSkills: false
  }

  return (
    <RepoAicrSettingsPage
      useRepoAicrSettingsStore={useRepoAicrSettingsStore}
      loadingStates={loadingStates}
      apiError={null}
      handleUpdateSuccessCriteria={handleUpdateSuccessCriteria}
      handleUpdateLlmConnector={handleUpdateLlmConnector}
      handleUpdateAgent={handleUpdateAgent}
      handleUpdateKnowledgeGraph={handleUpdateKnowledgeGraph}
      handleUpdateSystemPrompt={handleUpdateSystemPrompt}
      handleUpdateAgentSkills={handleUpdateAgentSkills}
    />
  )
}
