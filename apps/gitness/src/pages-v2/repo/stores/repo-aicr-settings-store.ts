import { create } from 'zustand'

import {
  AicrAgentRef,
  AicrAgentSkillRef,
  AicrConnectorRef,
  AicrKnowledgeSource,
  AicrSettings,
  IRepoAicrStore
} from '@harnessio/views'

interface IRepoAicrSettingsStore extends IRepoAicrStore {
  setSettings: (settings: AicrSettings | null) => void
  setAvailableConnectors: (connectors: AicrConnectorRef[]) => void
  setAvailableAgents: (agents: AicrAgentRef[]) => void
  setAvailableKnowledgeSources: (sources: AicrKnowledgeSource[]) => void
  setAvailableAgentSkills: (skills: AicrAgentSkillRef[]) => void
  reset: () => void
}

const initialState = {
  settings: null,
  availableConnectors: [],
  availableAgents: [],
  availableKnowledgeSources: [],
  availableAgentSkills: []
}

export const useRepoAicrSettingsStore = create<IRepoAicrSettingsStore>(set => ({
  ...initialState,
  setSettings: settings => set({ settings }),
  setAvailableConnectors: availableConnectors => set({ availableConnectors }),
  setAvailableAgents: availableAgents => set({ availableAgents }),
  setAvailableKnowledgeSources: availableKnowledgeSources => set({ availableKnowledgeSources }),
  setAvailableAgentSkills: availableAgentSkills => set({ availableAgentSkills }),
  reset: () => set(initialState)
}))
