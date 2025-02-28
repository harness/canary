import { EnumRuleState, type RepoRuleGetOkResponse } from '@harnessio/code-service-client'
import { BranchRuleId, MergeStrategy, PatternsButtonType, Rule } from '@harnessio/ui/views'

import { getTotalRulesApplied, transformDataFromApi, transformFormOutput } from '../repo-branch-rules-utils'

const mockApiResponse: RepoRuleGetOkResponse = {
  identifier: 'test-rule',
  description: 'Test rule description',
  state: 'active' as EnumRuleState,
  pattern: {
    default: true,
    include: ['main/*'],
    exclude: ['main/excluded']
  },
  definition: {
    bypass: {
      user_ids: [1, 2],
      repo_owners: true
    },
    lifecycle: {
      create_forbidden: true,
      delete_forbidden: false,
      update_forbidden: true
    },
    pullreq: {
      approvals: {
        require_code_owners: true,
        require_latest_commit: true,
        require_no_change_request: false,
        require_minimum_count: 2
      },
      comments: {
        require_resolve_all: true
      },
      merge: {
        strategies_allowed: ['merge', 'rebase'] as MergeStrategy[],
        delete_branch: true
      },
      status_checks: {
        require_identifiers: ['check1', 'check2']
      }
    }
  },
  users: {
    user1: { display_name: 'User One' },
    user2: { display_name: 'User Two' }
  }
}

const mockFormOutput = {
  identifier: 'test-rule',
  description: 'Test rule description',
  pattern: '',
  patterns: [
    { pattern: 'main/*', option: PatternsButtonType.INCLUDE },
    { pattern: 'main/excluded', option: PatternsButtonType.EXCLUDE }
  ],
  state: true,
  bypass: [
    { id: 1, display_name: 'User One' },
    { id: 2, display_name: 'User Two' }
  ],
  default: true,
  repo_owners: true,
  rules: [
    { id: BranchRuleId.REQUIRE_LATEST_COMMIT, checked: true },
    { id: BranchRuleId.REQUIRE_NO_CHANGE_REQUEST, checked: false },
    { id: BranchRuleId.COMMENTS, checked: true },
    { id: BranchRuleId.STATUS_CHECKS, checked: true, selectOptions: ['check1', 'check2'] },
    { id: BranchRuleId.MERGE, checked: true, submenu: ['merge', 'rebase'] },
    { id: BranchRuleId.DELETE_BRANCH, checked: true },
    { id: BranchRuleId.BLOCK_BRANCH_CREATION, checked: true },
    { id: BranchRuleId.BLOCK_BRANCH_DELETION, checked: false },
    { id: BranchRuleId.REQUIRE_PULL_REQUEST, checked: true },
    { id: BranchRuleId.REQUIRE_CODE_REVIEW, checked: true, input: '2' },
    { id: BranchRuleId.REQUIRE_CODE_OWNERS, checked: true }
  ] as unknown as Rule[]
}

describe('transformDataFromApi', () => {
  it('should transform API response to form data correctly', () => {
    const result = transformDataFromApi(mockApiResponse)

    expect(result.identifier).toBe('test-rule')
    expect(result.description).toBe('Test rule description')
    expect(result.state).toBe(true)
    expect(result.default).toBe(true)
    expect(result.repo_owners).toBe(true)

    // Check patterns
    expect(result.patterns).toEqual([
      { pattern: 'main/*', option: PatternsButtonType.INCLUDE },
      { pattern: 'main/excluded', option: PatternsButtonType.EXCLUDE }
    ])

    // Check bypass users
    expect(result.bypass).toEqual([])

    // Check rules
    const ruleMap = new Map(result.rules.map(rule => [rule.id, rule]))

    expect(ruleMap.get(BranchRuleId.REQUIRE_LATEST_COMMIT)?.checked).toBe(true)
    expect(ruleMap.get(BranchRuleId.REQUIRE_CODE_REVIEW)?.checked).toBe(true)
    expect(ruleMap.get(BranchRuleId.REQUIRE_CODE_REVIEW)?.input).toBe('2')
    expect(ruleMap.get(BranchRuleId.STATUS_CHECKS)?.selectOptions).toEqual(['check1', 'check2'])
    expect(ruleMap.get(BranchRuleId.MERGE)?.submenu).toEqual(['merge', 'rebase'])
  })

  it('should handle empty API response', () => {
    const emptyResponse = {
      identifier: '',
      state: 'disabled' as EnumRuleState
    }

    const result = transformDataFromApi(emptyResponse)

    expect(result.identifier).toBe('')
    expect(result.description).toBe('')
    expect(result.state).toBe(false)
    expect(result.patterns).toEqual([])
    expect(result.bypass).toEqual([])
  })
})

describe('transformFormOutput', () => {
  it('should transform form data to API request format correctly', () => {
    const result = transformFormOutput(mockFormOutput)

    expect(result?.identifier).toBe('test-rule')
    expect(result?.description).toBe('Test rule description')
    expect(result?.state).toBe('active')
    expect(result?.pattern?.default).toBe(true)

    // Check patterns
    expect(result?.pattern?.include).toEqual(['main/*'])
    expect(result?.pattern?.exclude).toEqual(['main/excluded'])

    // Check bypass
    expect(result?.definition?.bypass?.user_ids).toEqual([1, 2])
    expect(result?.definition?.bypass?.repo_owners).toBe(true)

    // Check lifecycle rules
    expect(result?.definition?.lifecycle?.create_forbidden).toBe(true)
    expect(result?.definition?.lifecycle?.delete_forbidden).toBe(false)
    expect(result?.definition?.lifecycle?.update_forbidden).toBe(true)

    // Check pull request rules
    expect(result?.definition?.pullreq?.approvals?.require_code_owners).toBe(true)
    expect(result?.definition?.pullreq?.approvals?.require_minimum_count).toBe(2)
    expect(result?.definition?.pullreq?.merge?.strategies_allowed).toEqual(['merge', 'rebase'])
    expect(result?.definition?.pullreq?.status_checks?.require_identifiers).toEqual(['check1', 'check2'])
  })
})

describe('getTotalRulesApplied', () => {
  it('should count total number of enabled rules correctly', () => {
    const total = getTotalRulesApplied(mockApiResponse)
    expect(total).toBe(9) // Count of all rules with checked=true in mockApiResponse
  })

  it('should return 0 for no enabled rules', () => {
    const emptyRules = {
      ...mockApiResponse,
      definition: {
        ...mockApiResponse.definition,
        lifecycle: {
          create_forbidden: false,
          delete_forbidden: false,
          update_forbidden: false
        },
        pullreq: {
          approvals: {
            require_code_owners: false,
            require_latest_commit: false,
            require_no_change_request: false,
            require_minimum_count: 0
          },
          comments: {
            require_resolve_all: false
          },
          merge: {
            strategies_allowed: [],
            delete_branch: false
          },
          status_checks: {
            require_identifiers: []
          }
        }
      }
    }

    const total = getTotalRulesApplied(emptyRules)
    expect(total).toBe(0)
  })
})
