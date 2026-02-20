import { IRepoStore, VulnerabilityScanningType } from '@harnessio/views'

export const useRepoRulesStore = (): IRepoStore => ({
  repoData: {
    name: 'canary',
    description: '',
    defaultBranch: 'main',
    isPublic: true,
    archived: false
  },
  rules: [
    {
      targetPatternsCount: 0,
      rulesAppliedCount: 0,
      bypassAllowed: false,
      identifier: 'Test',
      state: 'active'
    }
  ],
  securityScanning: false,
  verifyCommitterIdentity: false,
  gitLfsEnabled: false,
  presetRuleData: null,
  vulnerabilityScanning: VulnerabilityScanningType.DISABLED,
  principals: [
    {
      id: 4,
      uid: 'test1',
      display_name: 'Test 1',
      email: 'test@test.com',
      type: 'user',
      created: 1736313101847,
      updated: 1736313101847
    },
    {
      id: 5,
      uid: 'test2',
      display_name: 'Test 2',
      email: 'test@test.io',
      type: 'user',
      created: 1736833375578,
      updated: 1736833375578
    }
  ],
  userGroups: [
    {
      id: 6,
      identifier: 'test3',
      name: 'Test 3',
      description: 'usergroup description',
      scope: 0
    },
    {
      id: 7,
      identifier: 'test4',
      name: 'Test 4',
      description: 'usergroup description',
      scope: 0
    }
  ],
  recentStatusChecks: null
})
